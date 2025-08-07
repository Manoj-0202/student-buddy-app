def COLOR_MAP = [
    'SUCCESS': '#00FF00',
    'FAILURE': '#FF0000',
    'UNSTABLE': '#FFFF00',
    'ABORTED': '#FFA500'
] 
pipeline {
    agent any
    
    environment {
        SONAR_HOME = tool 'sonar-scanner';
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
                        sh 'cd frontend-new && npm install'
                    }
                }
                stage('Backend Dependency') {
                    steps {
                        sh '''
                            cd ../
                            cd backend/
                            python3 -m venv backend/venv
                            bash -c ". backend/venv/bin/activate && pip install --upgrade pip"
                            bash -c ". backend/venv/bin/activate && pip install -r backend/requirements.txt"
                        '''
                    }
                }
            }
        }
        stage('Dependency Scanning') {
            steps {
                sh 'npm audit --audit-level=critical'
                sh 'npm audit fix'
            }
        }
        // stage('Unit Test') {
        //     options { retry(2) }
        //     steps {
        //         sh 'npm test'
        //     }
        // }

        stage('SAST- SonarQube') {
            steps {
                sh 'sleep 5s'
                timeout(time: 60, unit: 'SECONDS') {
                    withSonarQubeEnv('sonar') {
                        sh 'echo $SONAR_HOME'
                        sh '''
                            $SONAR_HOME/sonar-scanner \
                                -Dsonar.projectKey=student_app \
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

        // stage('Trivy Docker Imgage Scan') {
        //     steps {
        //         sh '''
        //             trivy image ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} \
        //             --severity LOW,MEDIUM,HIGH \
        //             --exit-code 0 \
        //             --quiet \
        //             --format json -o student_trivy_MEDIUM_result.json

        //             trivy image ${DOCKER_IMAGE_NAME}:${BUILD_NUMBER} \
        //             --severity CRITICAL \
        //             --exit-code 0 \
        //             --quiet \
        //             --format json -o student_trivy_CRITICAL_result.json
        //         '''
        //     }
        //     post {
        //         always {
        //             sh '''
        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
        //                     --output student_trivy_MEDIUM_result.html student_trivy_MEDIUM_result.json

        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
        //                     --output student_trivy_CRITICAL_result.html student_trivy_CRITICAL_result.json
        //             '''
        //         }
        //     }
        // }

        stage('Docker Image Push') {
            withCredentials([usernamePassword(credentialsId: 'main-docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                sh 'echo pushing frontend application'
                sh 'docker push ${DOCKER_USERNAME}/${DOCKER_FRONT_IMAGE_NAME}:${BUILD_NUMBER}'
                sh 'echo pushing backend application'
                sh 'docker push ${DOCKER_USERNAME}/${DOCKER_BACK_IMAGE_NAME}:${BUILD_NUMBER}'
            }
        }

        // stage('Stop & Run In Docker composer') {
        //     steps {
        //         sh '''
        //             docker compose down || true
        //         '''
        //         sh 'docker compose up'
        //     }
        // }

        // stage('Deploy In K8s') {
        //     steps {
        //         helm upgrade --install student_app ${CHART_PATH} \
        //         --namespace student_app \
                

        //     }
        // }
        post {
            always {
                script {
                    def color = COLOR_MAP[currentBuild.currentResult] ?: '#FFFFFF'
                    def message = "Pipeline ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}"
                    slackSend channel: '#student_app', color: color, message: message
                }
            }
        }
    }
}