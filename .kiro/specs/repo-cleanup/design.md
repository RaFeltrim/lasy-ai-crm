# Design Document - Repository Cleanup

## Overview

Este documento descreve o design da solução para limpeza e organização final do repositório Lasy CRM. A abordagem é dividida em três fases sequenciais para minimizar riscos e facilitar validação incremental.

## Architecture

### Fase 1: Limpeza Imediata
Remoção de arquivos temporários e acidentais que não têm valor para o projeto.

### Fase 2: Reorganização de Documentação
Movimentação de arquivos de documentação remanescentes para a estrutura centralizada em `docs/`.

### Fase 3: Melhorias de Governança
Organização de arquivos de governança do GitHub e criação de templates.

## Components and Interfaces

### 1. File Cleanup Component

**Responsabilidade:** Identificar e remover arquivos temporários e acidentais.

**Arquivos Alvo:**
- `$null` - Arquivo vazio criado acidentalmente
- `-Force/` - Diretório vazio de erro de comando
- `PR_DESCRIPTION.md` - Arquivo temporário de PR
- `PR_CHECKLIST_VERIFICATION.md` - Arquivo temporário de validação

**Operações:**
```bash
# Remover arquivo $null
rm $null

# Remover diretório -Force
rmdir -Force

# Remover arquivos de PR
rm PR_DESCRIPTION.md PR_CHECKLIST_VERIFICATION.md
```

### 2. Documentation Reorganization Component

**Responsabilidade:** Mover arquivos de documentação para estrutura centralizada.

**Mapeamento de Arquivos:**

| Arquivo Origem | Destino | Categoria |
|----------------|---------|-----------|
| `FIX_NOTES_ERROR.md` | `docs/notes/FIX_NOTES_ERROR.md` | Nota técnica |
| `HYDRATION_FIX_FINAL.md` | `docs/notes/HYDRATION_FIX_FINAL.md` | Nota técnica |
| `SESSION_SUMMARY.md` | `docs/notes/SESSION_SUMMARY.md` | Nota técnica |
| `SUPABASE_SETUP.md` | `docs/guia/SUPABASE_SETUP.md` | Guia de setup |
| `CODE_OF_CONDUCT.md` | `.github/CODE_OF_CONDUCT.md` | Governança |

**Operações:**
```bash
# Usar git mv para preservar histórico
git mv FIX_NOTES_ERROR.md docs/notes/
git mv HYDRATION_FIX_FINAL.md docs/notes/
git mv SESSION_SUMMARY.md docs/notes/
git mv SUPABASE_SETUP.md docs/guia/
git mv CODE_OF_CONDUCT.md .github/
```

### 3. Link Update Component

**Responsabilidade:** Atualizar referências internas após movimentação de arquivos.

**Arquivos a Atualizar:**

1. **docs/README.md**
   - Atualizar links de `../HYDRATION_FIX_FINAL.md` → `notes/HYDRATION_FIX_FINAL.md`
   - Atualizar links de `../FIX_NOTES_ERROR.md` → `notes/FIX_NOTES_ERROR.md`
   - Atualizar links de `../SESSION_SUMMARY.md` → `notes/SESSION_SUMMARY.md`
   - Atualizar links de `../SUPABASE_SETUP.md` → `guia/SUPABASE_SETUP.md`

2. **README.md**
   - Verificar se há referências a SUPABASE_SETUP.md
   - Atualizar para `docs/guia/SUPABASE_SETUP.md`
   - Adicionar link para CODE_OF_CONDUCT.md em `.github/`

3. **docs/crm-documentation/12-CONTRIBUTING.md**
   - Verificar referências ao CODE_OF_CONDUCT.md
   - Atualizar para `../../.github/CODE_OF_CONDUCT.md`

### 4. Gitignore Enhancement Component

**Responsabilidade:** Melhorar .gitignore para prevenir futuros arquivos temporários.

**Novas Entradas:**

```gitignore
# Arquivos temporários do Windows
Thumbs.db
$null
ehthumbs.db

# Diretórios acidentais de PowerShell
-Force/

# Arquivos temporários de PR
PR_*.md
CHECKLIST_*.md

# Arquivos de autenticação do Playwright
playwright/.auth/
!playwright/.auth/.gitkeep

# Logs adicionais
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 5. GitHub Templates Component

**Responsabilidade:** Criar templates para PRs e Issues.

**Estrutura:**
```
.github/
├── CODE_OF_CONDUCT.md (movido)
├── PULL_REQUEST_TEMPLATE.md (novo)
└── ISSUE_TEMPLATE/
    ├── bug_report.md (novo)
    └── feature_request.md (novo)
```

**Pull Request Template:**
```markdown
## Descrição
<!-- Descreva as mudanças realizadas -->

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Build passou sem erros
- [ ] Testes unitários passaram
- [ ] Testes E2E passaram (se aplicável)
- [ ] Documentação atualizada
- [ ] Sem credenciais expostas
- [ ] Code review realizado

## Testes
<!-- Descreva como testar as mudanças -->

## Screenshots (se aplicável)
<!-- Adicione screenshots se relevante -->
```

## Data Models

### File Movement Record

```typescript
interface FileMovement {
  source: string          // Caminho original
  destination: string     // Novo caminho
  type: 'move' | 'delete' // Tipo de operação
  category: string        // Categoria do arquivo
  preserved_history: boolean // Se git mv foi usado
}
```

### Link Update Record

```typescript
interface LinkUpdate {
  file: string           // Arquivo contendo o link
  old_link: string       // Link antigo
  new_link: string       // Link novo
  line_number: number    // Linha do arquivo
}
```

## Error Handling

### Cenário 1: Arquivo Não Encontrado
**Situação:** Arquivo alvo da movimentação não existe.
**Ação:** Log de aviso e continuar com próximo arquivo.
**Impacto:** Baixo - arquivo já foi removido ou movido.

### Cenário 2: Link Quebrado Após Movimentação
**Situação:** Link interno aponta para arquivo que não existe.
**Ação:** Validação pós-movimentação identifica e reporta.
**Impacto:** Médio - requer correção manual.

### Cenário 3: Conflito de Nome de Arquivo
**Situação:** Arquivo de destino já existe.
**Ação:** Verificar conteúdo e decidir merge ou rename.
**Impacto:** Médio - requer decisão manual.

### Cenário 4: Falha no Build Após Limpeza
**Situação:** Build falha após remoção de arquivos.
**Ação:** Reverter mudanças e investigar dependências.
**Impacto:** Alto - requer rollback imediato.

## Testing Strategy

### 1. Validação de Arquivos Temporários
```bash
# Verificar que arquivos temporários foram removidos
test ! -f "$null"
test ! -d "-Force"
test ! -f "PR_DESCRIPTION.md"
test ! -f "PR_CHECKLIST_VERIFICATION.md"
```

### 2. Validação de Movimentação
```bash
# Verificar que arquivos foram movidos corretamente
test -f "docs/notes/FIX_NOTES_ERROR.md"
test -f "docs/notes/HYDRATION_FIX_FINAL.md"
test -f "docs/notes/SESSION_SUMMARY.md"
test -f "docs/guia/SUPABASE_SETUP.md"
test -f ".github/CODE_OF_CONDUCT.md"

# Verificar que arquivos não existem mais na raiz
test ! -f "FIX_NOTES_ERROR.md"
test ! -f "HYDRATION_FIX_FINAL.md"
test ! -f "SESSION_SUMMARY.md"
test ! -f "SUPABASE_SETUP.md"
test ! -f "CODE_OF_CONDUCT.md"
```

### 3. Validação de Links
```bash
# Buscar por links quebrados em docs/README.md
grep -n "\.\./HYDRATION_FIX_FINAL\.md" docs/README.md
# Deve retornar vazio (exit code 1)

# Verificar novos links
grep -n "notes/HYDRATION_FIX_FINAL\.md" docs/README.md
# Deve encontrar o link atualizado
```

### 4. Validação de Build
```bash
# Build de produção deve passar
npm run build

# Testes unitários devem passar
npm test

# Linting deve passar
npm run lint
```

### 5. Validação de Git History
```bash
# Verificar que git mv preservou histórico
git log --follow docs/notes/HYDRATION_FIX_FINAL.md
# Deve mostrar commits anteriores quando estava na raiz
```

## Implementation Phases

### Fase 1: Limpeza Imediata (Baixo Risco)
1. Remover `$null`
2. Remover `-Force/`
3. Remover `PR_DESCRIPTION.md`
4. Remover `PR_CHECKLIST_VERIFICATION.md`
5. Atualizar `.gitignore`
6. Commit: "chore: remove temporary files and update gitignore"

**Validação:** Verificar que arquivos foram removidos e build passa.

### Fase 2: Reorganização de Documentação (Médio Risco)
1. Mover arquivos de notas técnicas para `docs/notes/`
2. Mover guia de setup para `docs/guia/`
3. Atualizar links em `docs/README.md`
4. Atualizar links em `README.md`
5. Commit: "docs: move remaining documentation to docs/"

**Validação:** Verificar links e histórico git.

### Fase 3: Governança GitHub (Baixo Risco)
1. Mover `CODE_OF_CONDUCT.md` para `.github/`
2. Criar `PULL_REQUEST_TEMPLATE.md`
3. Criar templates de issues
4. Atualizar referências ao CODE_OF_CONDUCT
5. Commit: "chore: organize GitHub governance files"

**Validação:** Verificar que templates aparecem no GitHub.

## Rollback Strategy

### Se Fase 1 Falhar:
```bash
git reset --hard HEAD~1
# Restaurar arquivos temporários se necessário
```

### Se Fase 2 Falhar:
```bash
# Reverter movimentação de arquivos
git mv docs/notes/HYDRATION_FIX_FINAL.md ./
git mv docs/notes/FIX_NOTES_ERROR.md ./
git mv docs/notes/SESSION_SUMMARY.md ./
git mv docs/guia/SUPABASE_SETUP.md ./
# Reverter mudanças de links
git checkout HEAD -- docs/README.md README.md
```

### Se Fase 3 Falhar:
```bash
git mv .github/CODE_OF_CONDUCT.md ./
git reset --hard HEAD~1
```

## Success Criteria

1. ✅ Zero arquivos temporários na raiz
2. ✅ Toda documentação técnica em `docs/`
3. ✅ Arquivos de governança em `.github/`
4. ✅ `.gitignore` atualizado e funcional
5. ✅ Todos os links internos funcionando
6. ✅ Build passa sem erros
7. ✅ Testes passam 100%
8. ✅ Histórico git preservado para arquivos movidos
9. ✅ Templates de PR/Issue funcionando no GitHub

## Notes

- Usar `git mv` em vez de `mv` para preservar histórico
- Validar cada fase antes de prosseguir para a próxima
- Manter commits pequenos e focados
- Documentar qualquer decisão de design durante implementação
