#!groovy

pipeline {
  agent {
    node {
      label 'new'
    }
  }
  stages {
    stage('Setup') {
      steps {
        sh "npm install"
      }
     }
    stage('Test') {
      steps {
        sh "npm run test:all"
      }
    }
    stage('Build Production') {
      when {
        branch "master"
      }

      steps {
        sh "npm run clean"
        sh "npm run build:demo"
      }
    }
    stage('Deploy Production') {
      when {
        branch "master"
      }

      steps {
        sh "rsync -e 'ssh -o StrictHostKeyChecking=no' -va --rsync-path='mkdir -p /home/panel/web-sdk-demo/current/public/ && rsync' --delete ./demo/ panel@jenkins-2.adtrace.io://home/panel/web-sdk-demo/current/public/"
      }
    }
  }
  post {
    always {
      cleanWs()
    }
  }
}
