pipeline {
    agent any

    options {
        skipDefaultCheckout()
    }

    environment {
    }

    stages {
        stage('setup'){
            steps {
                cleanWs()
                dir("panel-ui") {
                    checkout scmGit(
                        branches: [[name: env.BRANCH_NAME]],
                        extensions: [ cloneOption(shallow: true) ],
                        userRemoteConfigs: [
                            [credentialsId:  'abdeb570-b708-44f3-b857-8a6b06ed9822',
                             url: 'ssh://code.g-r-l.com:6611/panel-ui']
                        ],

                    )
                }
            }
        }

        stage('npm.install') {
            steps {
                dir("panel-ui") {
                    sh "/usr/local/bin/npm install"
                }
            }
        }

        stage('npm.test') {
            steps {
                dir("panel-ui") {
                    sh "/usr/local/bin/npm run test"
                }
            }
        }
    }

}
