pipeline {
    agent any

    environment {
        SONAR_HOME = tool 'Sonar_Scanner'
        DOCKER_IMAGE = "hms-backend:latest"
    }

    stages {
        stage("Clone Code from Github") {
            steps {
                git url: "https://github.com/mdusmanhanifkhan/HMS-Backend.git", branch: "main"
            }
        }

        // stage("Sonar Quality Analysis") {
        //     steps {
        //         withSonarQubeEnv('Sonar') {
        //             withCredentials([string(credentialsId: 'Sonar', variable: 'SONAR_TOKEN')]) {
        //                 sh '''
        //                   ${SONAR_HOME}/bin/sonar-scanner \
        //                   -Dsonar.projectKey=HMS-Backend \
        //                   -Dsonar.projectName=HMS-Backend \
        //                   -Dsonar.sources=. \
        //                   -Dsonar.login=$SONAR_TOKEN
        //                 '''
        //             }
        //         }
        //     }
        // }
        
        stage("Trivy File System Scan"){
            steps{
                sh "trivy fs --format  table -o trivy-fs-report.html ."
            }
        }

       stage("Deploy using Docker Compose") {
           steps {
                sh '''
                  # Stop & remove all containers and orphans
                   docker-compose down --rmi all --volumes --remove-orphans
                   # Remove dangling images just in case
                   docker image prune -f
                   docker-compose up -d --build
                   '''
    }
}

    }
}
