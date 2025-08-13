def COLOR_MAP = [
    'SUCCESS': '#00FF00',
    'FAILURE': '#FF0000',
    'UNSTABLE': '#FFFF00',
    'ABORTED': '#FFA500'
] 
pipeline {
    agent any

    environment {
        SONAR_HOME = tool 'sonar-scanner'
        SONAR_ID = credentials('sonar')
        DOCKER_FRONT_IMAGE_NAME = 'student_frontend'
        DOCKER_BACK_IMAGE_NAME = 'student_backend'
        DOCKER_USERNAME = credentials('docker')
        CHART_PATH = './helm'
    }

    tools {
        nodejs 'nodejs-22-16-0'
    }

    stages {
        stage('Installing Dependencies') {
            parallel {
                stage('Frontend Dependency') {
                    steps {
                        sh 'pwd'
                        sh 'ls -lrt'
                        sh 'cd frontend-new && npm install'
                        sh 'pwd'
                    }
                }
                // stage('Backend Dependency') {
                //     steps {
                //         sh '''
                //             cd backend/
                //             pwd
                //             python3 -m venv venv
                //             bash -c ". venv/bin/activate && pip install --upgrade pip"
                //             bash -c ". venv/bin/activate && pip install -r requirements.txt"
                //         '''
                //     }
                // }
            }
        }

        stage('Dependency Scanning') {
            steps {
                sh 'npm audit --audit-level=critical'
                sh 'npm audit fix'
            }
        }

        stage('SAST - SonarQube') {
            steps {
                sh 'sleep 5s'
                timeout(time: 60, unit: 'SECONDS') {
                    withSonarQubeEnv('sonar') {
                        sh 'echo ${SONAR_HOME}'
                        sh '''
                            ${SONAR_HOME}/sonar-scanner \
                                -Dsonar.projectKey=student-buddy-app \
                                -Dsonar.sources=./frontend-new/ \
                                -Dsonar.host.url=http://localhost:9000 \
                                -Dsonar.login=${SONAR_ID}
                        '''
                    }
                }
            }
        }

        stage('Docker Build For Frontend') {
            steps {
                sh 'docker build -t ${DOCKER_USERNAME}/${DOCKER_FRONT_IMAGE_NAME}:${BUILD_NUMBER} -f ./frontend-new/Dockerfile ./frontend-new'
            }
        }

        stage('Docker Build For Backend') {
            steps {
                sh 'docker build -t ${DOCKER_USERNAME}/${DOCKER_BACK_IMAGE_NAME}:${BUILD_NUMBER} -f ./backend/Dockerfile ./backend'
            }
        }

        stage('Docker Image Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'main-docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                    sh '''
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USER --password-stdin
                        echo pushing frontend application
                        docker push ${DOCKER_USERNAME}/${DOCKER_FRONT_IMAGE_NAME}:${BUILD_NUMBER}
                        echo pushing backend application
                        docker push ${DOCKER_USERNAME}/${DOCKER_BACK_IMAGE_NAME}:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Trivy Docker Imgage Scan') {
            steps {
                sh '''
                    trivy image ${DOCKER_USERNAME}/${DOCKER_FRONT_IMAGE_NAME}:${BUILD_NUMBER} \
                    --severity LOW,MEDIUM,HIGH \
                    --exit-code 0 \
                    --quiet \
                    --format json -o student_frontend_trivy_MEDIUM_result.json

                    trivy image ${DOCKER_USERNAME}/${DOCKER_FRONT_IMAGE_NAME}:${BUILD_NUMBER} \
                    --severity CRITICAL \
                    --exit-code 0 \
                    --quiet \
                    --format json -o student_frontend_trivy_CRITICAL_result.json
                '''
            }
            post {
                always {
                    sh '''
                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output student_frontend_trivy_MEDIUM_result.html student_frontend_trivy_MEDIUM_result.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output student_frontend_trivy_CRITICAL_result.html student_frontend_trivy_CRITICAL_result.json
                    '''
                }
            }
        }
        stage('Update Image Tags') {
            steps {
                script {
                    // Define image tags based on Docker username and image names
                    def frontendImageTag = "${DOCKER_USERNAME}/${DOCKER_FRONT_IMAGE_NAME}:${BUILD_NUMBER}"
                    def backendImageTag = "${DOCKER_USERNAME}/${DOCKER_BACK_IMAGE_NAME}:${BUILD_NUMBER}"

                    // Update frontend image tag in frontendDeployment.yaml
                    sh """
                        sed -i 's|image: .*/${DOCKER_FRONT_IMAGE_NAME}.*|image: ${frontendImageTag}|' ./k8s/frontendDeployment.yaml
                    """

                    // Update backend image tag in backendDeployment.yaml
                    sh """
                        sed -i 's|image: .*/${DOCKER_BACK_IMAGE_NAME}.*|image: ${backendImageTag}|' ./k8s/backendDeployment.yaml
                    """
                }
            }
        }
        stage('Deploy in K8s') {
            steps {
                sh 'kubectl apply -f ./k8s -n dev-student-app'
            }
        }
    }

    post {
        always {
            script {
                def color = COLOR_MAP[currentBuild.currentResult] ?: '#FFFFFF'
                def message = "Pipeline ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}"
                slackSend(
                    baseUrl: 'https://slack.com/api',
                    teamDomain: 'DevOpsWolf',
                    channel: '#student_app',
                    color: color,
                    botUser: true,
                    tokenCredentialId: 'slack',
                    notifyCommitters: false,
                    iconEmoji: ':rocket:',
                    username: 'JenkinsBot',
                    timestamp: "${System.currentTimeMillis()}",
                    message: message
                )
            }
        }
    }
}
