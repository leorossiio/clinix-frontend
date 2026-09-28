/*
 * Pipeline de CI/CD do Clinix Frontend (Declarative Pipeline).
 *
 * O projeto Angular fica na pasta "clinix/". Todas as etapas rodam dentro da
 * imagem definida em clinix/Dockerfile.ci (Node 22 + Chromium).
 *
 * Plugins: Pipeline, Docker Pipeline, JUnit, Coverage, Workspace Cleanup, Timestamper.
 *
 * Deploy (opcional): se a integração Git da Vercel já publica a main, deixe
 * DEPLOY desmarcado e use o Jenkins só como portão de qualidade. Para publicar
 * pelo Jenkins, cadastre as credenciais (Secret text):
 *   - vercel-token, vercel-org-id, vercel-project-id
 */
pipeline {
  agent {
    dockerfile {
      dir 'clinix'
      filename 'Dockerfile.ci'
    }
  }

  parameters {
    booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Publicar em produção na Vercel (somente main)')
  }

  options {
    timestamps()
    timeout(time: 25, unit: 'MINUTES')
    disableConcurrentBuilds(abortPrevious: true)
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  environment {
    CI = 'true'
    // Cache do npm dentro do workspace: o usuário do container não tem HOME gravável.
    npm_config_cache = "${WORKSPACE}/.npm"
  }

  stages {
    stage('Instalar dependências') {
      steps {
        dir('clinix') { sh 'npm ci --no-audit --no-fund' }
      }
    }

    stage('Qualidade') {
      parallel {
        stage('Lint') {
          steps { dir('clinix') { sh 'npm run lint' } }
        }
        stage('Formatação') {
          steps { dir('clinix') { sh 'npm run format:check' } }
        }
        stage('Vulnerabilidades') {
          steps { dir('clinix') { sh 'npm audit --omit=dev --audit-level=high' } }
        }
      }
    }

    stage('Testes') {
      steps {
        // Cobertura mínima definida em karma.conf.js: abaixo dela, o build falha.
        dir('clinix') { sh 'npm run test:ci' }
      }
      post {
        always {
          junit testResults: 'clinix/reports/junit.xml', allowEmptyResults: false
          recordCoverage(tools: [[parser: 'COBERTURA', pattern: 'clinix/reports/coverage/cobertura-coverage.xml']])
        }
      }
    }

    stage('Build de produção') {
      steps {
        dir('clinix') { sh 'npm run build' }
      }
      post {
        success {
          archiveArtifacts artifacts: 'clinix/dist/clinix/browser/**', fingerprint: true
        }
      }
    }

    stage('Deploy na Vercel') {
      when {
        allOf { branch 'main'; expression { params.DEPLOY } }
      }
      steps {
        withCredentials([
          string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
          string(credentialsId: 'vercel-org-id', variable: 'VERCEL_ORG_ID'),
          string(credentialsId: 'vercel-project-id', variable: 'VERCEL_PROJECT_ID'),
        ]) {
          dir('clinix') {
            sh 'npx --yes vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN"'
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs(deleteDirs: true, notFailBuild: true)
    }
  }
}
