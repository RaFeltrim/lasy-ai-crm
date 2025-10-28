# Implementation Plan

- [x] 1. Preparar ambiente e criar branch





  - Verificar que não há mudanças não commitadas no repositório
  - Criar branch `chore/organize-repo-docs` a partir da branch principal
  - Verificar estrutura atual de pastas em docs/
  - _Requirements: 5.1_

- [x] 2. Reorganizar arquivos de docs/fixes/






  - [x] 2.1 Mover notas técnicas para docs/notes/

    - Executar `git mv docs/fixes/DRAG_DROP_FIX.md docs/notes/`
    - Executar `git mv docs/fixes/FINAL_FIXES.md docs/notes/`
    - Executar `git mv docs/fixes/STRICTMODE_FIX.md docs/notes/`
    - Executar `git mv docs/fixes/STATUS_CHANGE.md docs/notes/`
    - Executar `git mv docs/fixes/CRITICAL_PATCH.md docs/notes/`
    - _Requirements: 1.1, 1.2_


  - [x] 2.2 Mover guia de autenticação para docs/guia/

    - Executar `git mv docs/fixes/AUTHENTICATION.md docs/guia/`
    - _Requirements: 1.2_


  - [x] 2.3 Arquivar DEPLOYMENT.md em docs/_obsolete/

    - Executar `git mv docs/fixes/DEPLOYMENT.md docs/_obsolete/`
    - _Requirements: 6.1, 6.2_


  - [x] 2.4 Criar commit para movimentações de fixes

    - Executar `git commit -m "docs: mover arquivos de fixes para notes e guia"`
    - _Requirements: 5.2_

- [x] 3. Consolidar Crm-Documentation/





  - [x] 3.1 Mover pasta Crm-Documentation para docs/


    - Executar `git mv Crm-Documentation docs/crm-documentation`
    - Verificar que todos os arquivos foram movidos corretamente
    - _Requirements: 1.5_


  - [x] 3.2 Criar commit para consolidação

    - Executar `git commit -m "docs: fundir Crm-Documentation em docs/crm-documentation"`
    - _Requirements: 5.2_

- [x] 4. Arquivar arquivos obsoletos da raiz






  - [x] 4.1 Mover arquivos de reorganização para _obsolete

    - Executar `git mv REORGANIZATION_PLAN.md docs/_obsolete/`
    - Executar `git mv REORGANIZATION_GUIDE.md docs/_obsolete/`
    - Executar `git mv EXECUTE_REORGANIZATION.md docs/_obsolete/`
    - Executar `git mv reorganize.ps1 docs/_obsolete/`
    - Executar `git mv reorganize-fixed.ps1 docs/_obsolete/`
    - _Requirements: 6.1, 6.2_


  - [x] 4.2 Criar commit para arquivamento

    - Executar `git commit -m "docs: arquivar arquivos obsoletos em _obsolete"`
    - _Requirements: 5.2_

- [x] 5. Criar índice principal da documentação






  - [x] 5.1 Criar docs/README.md com estrutura completa


    - Criar arquivo docs/README.md
    - Adicionar título e introdução
    - Criar seção "Guias de Configuração" com links para guia/
    - Criar seção "Documentação Completa do CRM" com links para crm-documentation/
    - Criar seção "Notas Técnicas e Fixes" com links para notes/
    - Adicionar nota sobre pasta _obsolete/
    - _Requirements: 6.3, 6.5_



  - [x] 5.2 Criar commit para índice




    - Executar `git add docs/README.md`
    - Executar `git commit -m "docs: criar índice principal em docs/README.md"`
    - _Requirements: 5.2_
-

- [x] 6. Atualizar README.md principal



  - [x] 6.1 Verificar e remover credenciais expostas


    - Ler README.md atual
    - Identificar URLs ou chaves reais do Supabase
    - Substituir por placeholders que referenciem .env.local
    - _Requirements: 3.1, 3.5_

  - [x] 6.2 Adicionar seção de segurança de credenciais


    - Adicionar seção "⚠️ Segurança de Credenciais" após "🔒 Security Notes"
    - Incluir instruções sobre rotação de chaves expostas
    - Incluir passos para revogar acesso comprometido
    - Incluir dicas de prevenção de futuras exposições
    - _Requirements: 3.2_

  - [x] 6.3 Atualizar seção "📁 Project Structure"


    - Adicionar pasta docs/ com subpastas na estrutura
    - Adicionar descrições das subpastas (guia/, notes/, crm-documentation/)
    - Adicionar link para docs/README.md ao final da seção
    - _Requirements: 4.2, 4.4_

  - [x] 6.4 Corrigir comandos de instalação


    - Verificar comandos git clone e cd
    - Garantir que referenciam lasy-ai-crm corretamente
    - _Requirements: 4.1_

  - [x] 6.5 Criar commit para atualização do README


    - Executar `git add README.md`
    - Executar `git commit -m "docs: atualizar README.md e remover credenciais"`
    - _Requirements: 5.2, 3.5_

- [x] 7. Limpar estrutura antiga







  - [x] 7.1 Remover pasta docs/fixes/ vazia

    - Verificar que pasta docs/fixes/ está vazia
    - Executar `git rm -r docs/fixes/`
    - _Requirements: 1.1_


  - [x] 7.2 Criar commit para limpeza

    - Executar `git commit -m "chore: remover pasta docs/fixes vazia"`
    - _Requirements: 5.2_

- [-] 8. Validar mudanças





  - [ ] 8.1 Executar instalação limpa de dependências
    - Executar `npm ci`
    - Verificar que instalação completa sem erros
    - _Requirements: 2.5_


  - [x] 8.2 Executar build de produção

    - Executar `npm run build`
    - Verificar que build completa sem erros
    - Confirmar que não há mudanças no bundle
    - _Requirements: 2.5_


  - [x] 8.3 Executar testes unitários

    - Executar `npm test`
    - Verificar que todos os testes passam
    - _Requirements: 2.5_

  - [x] 8.4 Executar testes E2E (opcional)













    - Executar `npx playwright install` se necessário
    - Executar `npm run test:e2e`
    - Verificar que testes E2E passam
    - _Requirements: 2.5_

- [x] 9. Criar Pull Request




  - [x] 9.1 Push da branch para repositório remoto


    - Executar `git push origin chore/organize-repo-docs`
    - _Requirements: 5.1_

  - [x] 9.2 Criar PR com título e descrição adequados


    - Criar PR com título "chore(repo): organizar docs e arquivar notas"
    - Adicionar descrição detalhada das mudanças
    - Incluir checklist de validação no corpo do PR
    - Incluir tabela resumindo movimentações (origem → destino)
    - Adicionar trechos relevantes dos logs de build e testes
    - _Requirements: 5.4, 5.5_



  - [ ] 9.3 Verificar checklist do PR
    - Confirmar que build passou sem mudanças no bundle
    - Confirmar que deploy não foi afetado
    - Confirmar que não há segredos no README
    - Confirmar que documentação está centralizada em docs/
    - Confirmar que arquivos obsoletos estão em _obsolete/
    - _Requirements: 5.5_
