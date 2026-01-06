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
           # 1️⃣ Stop & remove the existing container if it exists
            docker rm -f hms-backend-app || true

            # 2️⃣ Remove the existing image if it exists
            docker rmi hms-backend-app:latest || true

            # 3️⃣ Build a new image from Dockerfile
            docker build -t hms-backend-app:latest .

            # 4️⃣ Run the container
            docker run -d \
  --name hms-backend-app \
  -p 3000:3000 \
  --env NODE_ENV=production \
  --env PORT=3000 \
  --env CORE_ORIGIN_FRONTEND=https://hikarimed.vercel.app \
  --env APP_BASE_URL=https://hikarimed.online \
  --env APP_BASE_URL_WWW=https://www.hikarimed.online \
  hms-backend-app:latest

                   '''
    }
}

    }
}
