pipeline {
    agent any

    triggers {
      pollSCM('H/1 * * * *')
    }

    environment {
        BUILD_DIR = "dist"
        JS_FILENAME = "grl-panel"
    }

    options {
        skipDefaultCheckout()
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

        stage('npm.build') {

            steps {
                dir("panel-ui") {
                    sh "/usr/local/bin/npm run build"
                    script {
                        dir(env.BUILD_DIR) {
                            def minSize = 750 * 1024
                            def size = sh(script: "stat -c%s ${env.JS_FILENAME}.js", returnStdout: true).trim().toInteger()

                            if (size < minSize) {
                                error "Build is too small: ${size} bytes"
                            } else {
                                echo "Build size is acceptable: ${size} bytes"
                            }
                        }
                    }
                }
            }
        }

        stage('cdn.deploy.master') {
            when {
                expression { env.BRANCH_NAME == 'master' }
            }
            steps {
                dir("panel-ui") {
                    dir(env.BUILD_DIR) {
                        sh "/usr/bin/rsync -v ${env.JS_FILENAME}.js grl-cdn:/root/gr-cdn/"
                    }
                }
            }
        }

        stage('cdn.deploy.non-master') {
            when {
                expression { env.BRANCH_NAME != 'master' }
            }
            steps {
                dir("panel-ui") {
                    script {
                        echo "Detected branch: ${env.BRANCH_NAME}"
                        def versioned = "${env.JS_FILENAME}-${env.BRANCH_NAME}"

                        dir(env.BUILD_DIR) {
                            sh "cp ${env.JS_FILENAME}.js ${versioned}.js"
                            sh "/usr/bin/rsync -v ${versioned}.js grl-cdn:/root/gr-cdn/"
                        }
                    }

                }
            }
        }

        stage('cdn.deploy.tag') {
            when {
                expression {
                    return env.TAG_NAME?.trim()
                }
            }

            steps {
                dir("panel-ui") {
                    script {
                        echo "Detected tag: ${env.TAG_NAME}"
                        def versioned = "${env.JS_FILENAME}-${env.TAG_NAME}"

                        dir(env.BUILD_DIR) {
                            sh "cp ${env.JS_FILENAME}.js ${versioned}.js"
                            sh "/usr/bin/rsync -v ${versioned}.js grl-cdn:/root/gr-cdn/"
                        }
                    }

                }
            }
        }

    }

}
