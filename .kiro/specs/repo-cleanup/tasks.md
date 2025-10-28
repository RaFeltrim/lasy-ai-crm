# Implementation Plan - Repository Cleanup

- [ ] 1. Fase 1: Limpeza de Arquivos Temporários





  - Remover arquivos temporários e acidentais da raiz do repositório
  - Atualizar .gitignore para prevenir futuros arquivos temporários
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5_


- [x] 1.1 Remover arquivo $null

  - Executar comando para deletar o arquivo `$null` da raiz
  - Verificar que o arquivo foi removido com sucesso
  - _Requirements: 1.1_


- [x] 1.2 Remover diretório -Force


  - Executar comando para deletar o diretório vazio `-Force/`
  - Verificar que o diretório foi removido com sucesso
  - _Requirements: 1.2_


- [x] 1.3 Remover arquivos temporários de PR

  - Deletar `PR_DESCRIPTION.md` da raiz
  - Deletar `PR_CHECKLIST_VERIFICATION.md` da raiz
  - Verificar que ambos os arquivos foram removidos
  - _Requirements: 1.3_


- [x] 1.4 Atualizar .gitignore

  - Adicionar regras para arquivos temporários do Windows (Thumbs.db, $null)
  - Adicionar regras para diretórios acidentais de PowerShell (-Force/)
  - Adicionar regras para arquivos temporários de PR (PR_*.md)
  - Adicionar regras para arquivos de autenticação do Playwright (playwright/.auth/)
  - Adicionar regras para logs adicionais
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_


- [x] 1.5 Validar limpeza de arquivos temporários

  - Executar comandos de verificação para confirmar remoção de arquivos
  - Executar `npm run build` para verificar que build passa
  - Verificar que .gitignore está funcionando corretamente
  - _Requirements: 5.2_

- [-] 1.6 Commit das mudanças da Fase 1

  - Criar commit com mensagem "chore: remove temporary files and update gitignore"
  - Verificar que commit contém apenas as mudanças esperadas
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Fase 2: Reorganização de Documentação
  - Mover arquivos de documentação remanescentes para docs/
  - Atualizar todos os links internos para refletir novos caminhos
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 2.1 Mover notas técnicas para docs/notes/
  - Executar `git mv FIX_NOTES_ERROR.md docs/notes/`
  - Executar `git mv HYDRATION_FIX_FINAL.md docs/notes/`
  - Executar `git mv SESSION_SUMMARY.md docs/notes/`
  - Verificar que arquivos foram movidos e não existem mais na raiz
  - _Requirements: 2.2, 2.3_

- [ ] 2.2 Mover guia de setup para docs/guia/
  - Executar `git mv SUPABASE_SETUP.md docs/guia/`
  - Verificar que arquivo foi movido e não existe mais na raiz
  - _Requirements: 2.2, 2.4_

- [ ] 2.3 Atualizar links em docs/README.md
  - Atualizar link de `../HYDRATION_FIX_FINAL.md` para `notes/HYDRATION_FIX_FINAL.md`
  - Atualizar link de `../FIX_NOTES_ERROR.md` para `notes/FIX_NOTES_ERROR.md`
  - Atualizar link de `../SESSION_SUMMARY.md` para `notes/SESSION_SUMMARY.md`
  - Remover nota sobre arquivos na raiz (já que todos foram movidos)
  - _Requirements: 2.5_

- [ ] 2.4 Atualizar referências em README.md
  - Buscar referências a `SUPABASE_SETUP.md` no README principal
  - Atualizar para `docs/guia/SUPABASE_SETUP.md`
  - Verificar se há outras referências a arquivos movidos
  - _Requirements: 2.5_

- [ ] 2.5 Validar links e histórico git
  - Executar busca por links quebrados em arquivos markdown
  - Verificar histórico git com `git log --follow` para arquivos movidos
  - Confirmar que histórico foi preservado
  - _Requirements: 2.2, 5.3, 5.4_

- [ ] 2.6 Validar build após reorganização
  - Executar `npm run build` para verificar que build passa
  - Executar `npm test` para verificar que testes passam
  - Verificar que não há erros ou warnings
  - _Requirements: 5.1, 5.2_

- [ ] 2.7 Commit das mudanças da Fase 2
  - Criar commit com mensagem "docs: move remaining documentation to docs/"
  - Verificar que commit preserva histórico dos arquivos movidos
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3. Fase 3: Organização de Governança GitHub
  - Mover CODE_OF_CONDUCT.md para .github/
  - Criar templates de PR e Issues
  - Atualizar referências aos arquivos de governança
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3.1 Mover CODE_OF_CONDUCT.md para .github/
  - Executar `git mv CODE_OF_CONDUCT.md .github/`
  - Verificar que arquivo foi movido e não existe mais na raiz
  - _Requirements: 3.1_

- [ ] 3.2 Criar Pull Request Template
  - Criar arquivo `.github/PULL_REQUEST_TEMPLATE.md`
  - Incluir seções: Descrição, Tipo de Mudança, Checklist, Testes, Screenshots
  - Adicionar checklist baseado nos requisitos do projeto
  - _Requirements: 3.2_

- [ ] 3.3 Criar Issue Templates
  - Criar diretório `.github/ISSUE_TEMPLATE/`
  - Criar template `bug_report.md` para reportar bugs
  - Criar template `feature_request.md` para solicitar features
  - Incluir campos relevantes em cada template
  - _Requirements: 3.2_

- [ ] 3.4 Atualizar referências ao CODE_OF_CONDUCT
  - Atualizar link em README.md para `.github/CODE_OF_CONDUCT.md`
  - Verificar referências em `docs/crm-documentation/12-CONTRIBUTING.md`
  - Atualizar para caminho relativo correto `../../.github/CODE_OF_CONDUCT.md`
  - _Requirements: 3.3_

- [ ] 3.5 Validar templates no GitHub
  - Verificar que PULL_REQUEST_TEMPLATE.md aparece ao criar PR
  - Verificar que issue templates aparecem ao criar issue
  - Confirmar que links para CODE_OF_CONDUCT funcionam
  - _Requirements: 3.2, 3.3_

- [ ] 3.6 Commit das mudanças da Fase 3
  - Criar commit com mensagem "chore: organize GitHub governance files and templates"
  - Verificar que commit contém todos os arquivos novos e movidos
  - _Requirements: 3.1, 3.2_

- [ ] 4. Validação Final e Documentação
  - Executar validação completa de todas as mudanças
  - Verificar integridade do repositório
  - Documentar mudanças realizadas
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4.1 Executar suite completa de testes
  - Executar `npm test` para testes unitários
  - Executar `npm run build` para build de produção
  - Verificar que não há erros ou warnings
  - _Requirements: 5.1, 5.2_

- [ ] 4.2 Validar estrutura de arquivos
  - Verificar que raiz contém apenas arquivos essenciais
  - Verificar que docs/ contém toda documentação técnica
  - Verificar que .github/ contém arquivos de governança
  - Listar arquivos na raiz e confirmar limpeza
  - _Requirements: 2.1, 3.1, 5.5_

- [ ] 4.3 Validar links internos
  - Executar busca por padrões de links quebrados (../ para arquivos movidos)
  - Verificar manualmente links em README.md
  - Verificar manualmente links em docs/README.md
  - Confirmar que todos os links funcionam
  - _Requirements: 2.5, 5.3_

- [ ] 4.4 Verificar histórico git
  - Usar `git log --follow` para cada arquivo movido
  - Confirmar que histórico foi preservado
  - Verificar que commits estão bem organizados
  - _Requirements: 2.2, 5.4_

- [ ] 4.5 Criar documentação de mudanças
  - Criar arquivo `CLEANUP_SUMMARY.md` documentando todas as mudanças
  - Incluir tabela de movimentação de arquivos
  - Incluir lista de arquivos removidos
  - Incluir instruções para encontrar documentação
  - _Requirements: 2.1, 2.5_

- [ ] 5. Criar Pull Request
  - Push da branch para repositório remoto
  - Criar PR com descrição detalhada
  - Verificar checklist do PR
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5.1 Push da branch para repositório remoto
  - Criar branch `chore/repo-cleanup`
  - Executar `git push origin chore/repo-cleanup`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5.2 Criar PR com título e descrição adequados
  - Criar PR com título "chore(repo): cleanup temporary files and finalize docs organization"
  - Adicionar descrição detalhada das 3 fases
  - Incluir tabela de movimentação de arquivos
  - Incluir checklist de validação
  - Adicionar logs de build e testes
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5.3 Verificar checklist do PR
  - Confirmar que build passou sem erros
  - Confirmar que testes passaram 100%
  - Confirmar que não há links quebrados
  - Confirmar que histórico git foi preservado
  - Confirmar que estrutura de arquivos está limpa
  - Confirmar que templates do GitHub funcionam
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
