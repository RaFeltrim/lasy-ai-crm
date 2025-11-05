# 🔧 Fix: "Could not find the 'notes' column of 'leads'"

## Problema

Ao criar um lead, aparece o erro:

```
Error: Could not find the 'notes' column of 'leads' in the schema cache
```

## Causa

O schema cache do PostgREST no Supabase não está sincronizado com a estrutura real da tabela.

## Solução (2 métodos)

### Método 1: Aplicar Migration (RECOMENDADO)

1. **Acesse o Supabase SQL Editor**
   - URL: https://qxbgltpxqhuhzyjfbcdp.supabase.co
   - Navegue para: **SQL Editor** no menu lateral

2. **Execute a Migration 0003**

   ```sql
   -- Ensure notes column exists in leads table
   ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

   -- Refresh PostgREST schema cache
   NOTIFY pgrst, 'reload schema';
   ```

3. **Clique em "Run"**

4. **Teste criando um lead novamente**

### Método 2: Reload Manual do Schema

Se a migration não funcionar, force o reload:

1. **Vá para o SQL Editor no Supabase**

2. **Execute este comando**:

   ```sql
   NOTIFY pgrst, 'reload schema';
   ```

3. **Aguarde 5 segundos**

4. **Teste novamente**

### Método 3: Recriar a Tabela (ÚLTIMO RECURSO)

⚠️ **ATENÇÃO**: Isso apagará todos os leads existentes!

1. **Backup dos dados** (se houver):

   ```sql
   SELECT * FROM leads;
   ```

2. **Drop e recriar**:

   ```sql
   DROP TABLE IF EXISTS leads CASCADE;
   ```

3. **Execute novamente a migration 0001_initial_schema.sql**

## Verificação

Após aplicar a correção, verifique se a coluna existe:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name = 'notes';
```

Deve retornar:

```
column_name | data_type
------------|----------
notes       | text
```

## Teste Final

1. Acesse: http://localhost:3000/leads/new
2. Preencha todos os campos incluindo "Notes"
3. Clique em "Create Lead"
4. ✅ Deve criar sem erros
5. ✅ Lead aparece no dashboard

## Prevenção

Este erro ocorre quando:

- As migrations não são executadas na ordem correta
- O PostgREST não recarrega o schema automaticamente
- Há conflito entre schema do banco e cache do PostgREST

**Sempre execute**: `NOTIFY pgrst, 'reload schema';` após mudanças no schema.
