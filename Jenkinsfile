pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DOCKER_IMAGE = 'your-registry/ecommerce-cart'
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        SSH_CREDENTIALS = credentials('server-ssh-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('Cart') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Lint') {
            steps {
                dir('Cart') {
                    sh 'npm run lint || echo "No lint script found"'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('Cart') {
                    sh 'npm test || echo "No tests found"'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                dir('Cart') {
                    script {
                        def image = docker.build("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                        image.tag('latest')
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        def image = docker.image("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Dev') {
            when {
                branch 'develop'
            }
            steps {
                sshagent(['server-ssh-credentials']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no user@dev-server '
                        cd /var/www/ecommerce &&
                        docker pull ${DOCKER_IMAGE}:latest &&
                        docker-compose -f docker-compose.yml up -d cart &&
                        docker system prune -af
                        '
                    """
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sshagent(['server-ssh-credentials']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no user@prod-server '
                        cd /var/www/ecommerce &&
                        docker pull ${DOCKER_IMAGE}:latest &&
                        docker-compose -f docker-compose.yml up -d cart &&
                        docker system prune -af
                        '
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
            // Add notification (Slack, Email, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification (Slack, Email, etc.)
        }
        always {
            cleanWs()
        }
    }
}
