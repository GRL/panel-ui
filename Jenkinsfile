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
                        def filePath = "dist/grl-panel.js"
                        def minSize = 500 * 1024
                        def size = sh(script: "stat -c%s ${filePath}", returnStdout: true).trim().toInteger()

                        if (size < minSize) {
                            error "Build ${filePath} is too small: ${size} bytes"
                        } else {
                            echo "Build size is acceptable: ${size} bytes"
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
                    sh "/usr/bin/rsync -v ${env.BUILD_DIR}/${env.JS_FILENAME}.js grl-cdn:/root/gr-cdn/"
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
                        def branch = env.BRANCH_NAME
                        echo "Detected branch: ${branch}"
                        def versioned = "${env.BUILD_DIR}/${env.JS_FILENAME}-${branch}.js"
                        sh "cp ${env.BUILD_DIR}/${env.JS_FILENAME}.js ${versioned}"
                    }

                    sh "/usr/bin/rsync -v ${env.BUILD_DIR}/${versioned}.js grl-cdn:/root/gr-cdn/"
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
                        def tag = env.TAG_NAME
                        echo "Detected tag: ${tag}"
                        def versioned = "${env.BUILD_DIR}/${env.JS_FILENAME}-${tag}.js"
                        sh "cp ${env.BUILD_DIR}/${env.JS_FILENAME}.js ${versioned}"
                    }

                    sh "/usr/bin/rsync -v ${env.BUILD_DIR}/${versioned} grl-cdn:/root/gr-cdn/"

                }
            }
        }

    }

}
