# Pull Request

## Descrição
<!-- Descreva as mudanças realizadas neste PR -->

## Tipo de Mudança
<!-- Marque as opções relevantes -->

- [ ] 🐛 Bug fix (correção de bug)
- [ ] ✨ Nova feature (nova funcionalidade)
- [ ] 💥 Breaking change (mudança que quebra compatibilidade)
- [ ] 📝 Documentação (atualização de docs)
- [ ] 🎨 Style (formatação, sem mudança de lógica)
- [ ] ♻️ Refactor (reestruturação de código)
- [ ] ⚡ Performance (melhoria de performance)
- [ ] ✅ Tests (adição ou correção de testes)
- [ ] 🔧 Chore (manutenção, dependências)

## Motivação e Contexto
<!-- Por que essa mudança é necessária? Qual problema resolve? -->
<!-- Se resolve uma issue, referencie aqui: Closes #123 -->

## Como Foi Testado?
<!-- Descreva os testes realizados para verificar suas mudanças -->

- [ ] Testes unitários (Vitest)
- [ ] Testes E2E (Playwright)
- [ ] Testes manuais
- [ ] Build de produção

**Detalhes dos testes:**
<!-- Descreva os cenários testados -->

## Screenshots (se aplicável)
<!-- Adicione screenshots ou GIFs para mudanças visuais -->

## Checklist

### Qualidade de Código
- [ ] Meu código segue o style guide do projeto
- [ ] Realizei self-review do meu código
- [ ] Comentei código complexo ou não-óbvio
- [ ] Não há warnings ou erros no console
- [ ] Não há código comentado ou debug logs

### Testes
- [ ] Adicionei testes que provam que minha correção funciona ou que minha feature está funcionando
- [ ] Testes unitários novos e existentes passam localmente (`npm test`)
- [ ] Testes E2E passam localmente (`npm run test:e2e`)
- [ ] Build de produção passa sem erros (`npm run build`)

### Documentação
- [ ] Atualizei a documentação relevante em `docs/`
- [ ] Atualizei o README.md (se necessário)
- [ ] Atualizei comentários JSDoc em funções públicas
- [ ] Atualizei schemas Zod (se mudanças em tipos)

### Segurança
- [ ] Não expus credenciais ou chaves de API
- [ ] Não commitei arquivos `.env` ou `.env.local`
- [ ] Validei inputs do usuário com Zod
- [ ] Implementei RLS policies (se mudanças no banco)

### Database (se aplicável)
- [ ] Criei migration SQL em `supabase/migrations/`
- [ ] Testei migration em ambiente local
- [ ] Atualizei seed.sql (se necessário)
- [ ] Verifiquei RLS policies

### Dependências
- [ ] Não adicionei dependências desnecessárias
- [ ] Atualizei `package.json` e `package-lock.json`
- [ ] Verifiquei vulnerabilidades (`npm audit`)

## Impacto

### Breaking Changes
<!-- Se marcou "Breaking change" acima, descreva o impacto e migration path -->

### Performance
<!-- Há impacto de performance? Positivo ou negativo? -->

### Acessibilidade
<!-- Mudanças afetam acessibilidade? Testou com screen readers? -->

## Notas Adicionais
<!-- Qualquer informação adicional relevante para os reviewers -->

## Reviewers
<!-- Marque pessoas específicas se necessário: @username -->

---

**Lembre-se:** Code review é cultura, não burocracia. Veja nosso [Code of Conduct](CODE_OF_CONDUCT.md) para guidelines de review.
