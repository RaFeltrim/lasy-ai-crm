# Code of Conduct

## Our Philosophy

> **"Code Review is Culture, not bureaucracy."**  
> — André Girol

This Code of Conduct is inspired by the principles from [André Girol's Code Review presentation](https://docs.google.com/presentation/d/1DE6yqBJUAH42RI-q9K3ruQqi2qPiUwgrM8qeQeSxlMo/edit) and reflects our commitment to respectful, productive collaboration.

---

## Core Values

### 1. **Kindness First** 🤝

- Be gentle and constructive in all feedback
- Remember: **"Your code doesn't define you as a person"**
- Praise good solutions and interesting approaches
- Assume positive intent

### 2. **Clarity & Precision** 📍

- Be specific: "In method `calculateTotal()`, line 42, rename `x` to `totalAmount`"
- Explain WHY changes are needed, not just WHAT
- Provide examples when suggesting alternatives
- Link to relevant documentation

### 3. **Mentorship Mindset** 🎓

- Use code reviews as teaching opportunities
- Share knowledge about patterns, tools, and best practices
- Encourage questions and discussion
- Help junior developers grow

### 4. **Respect for Time** ⏰

- Respond to review requests within 1 business day
- Keep PRs small and focused (Small CLs principle)
- Write clear descriptions and context
- Don't block on nitpicks that linters can fix

### 5. **Professionalism** 💼

- Focus on code quality, not personal preferences
- Avoid "herd mentality" - review independently
- No power dynamics - everyone's code gets reviewed
- Separate technical critique from personal worth

---

## For Reviewers

### DO ✅

- **Respond quickly** - First response within 24 hours
- **Be precise** - Point to exact file, line, variable
- **Explain rationale** - Why is this change needed?
- **Praise solutions** - "Nice use of memoization here!"
- **Ask questions** - "Could we simplify this with...?"
- **Suggest learning** - "Check out this pattern in 02-ARCHITECTURE.md"
- **Verify checklist** - Use the PR template checklist

### DON'T ❌

- **Nitpick** - Avoid comments on auto-fixable issues (spaces, commas)
- **Rubber stamp** - "LGTM" without actually reading
- **Be vague** - "This looks wrong" → "In line 42, `status` should be lowercase"
- **Make it personal** - Focus on code, not coder
- **Block unnecessarily** - Approve with non-blocking suggestions
- **Delay** - Don't leave PRs waiting for days

---

## For Authors (PR Submitters)

### DO ✅

- **Write context** - Explain what, why, and how in PR description
- **Keep PRs small** - Small CLs are easier to review (< 500 lines)
- **Add tests** - Cover your changes with automated tests
- **Self-review first** - Review your own PR before requesting others
- **Accept feedback** - Don't take it personally
- **Ask questions** - "Should I refactor this differently?"
- **Update docs** - Keep `Crm-Documentation/` current

### DON'T ❌

- **Submit huge PRs** - Break large changes into smaller parts
- **Skip tests** - "I'll add tests later" → No, add them now
- **Ignore feedback** - Address or discuss all comments
- **Take it personally** - Code review ≠ personal criticism
- **Skip context** - Empty PR descriptions are unhelpful
- **Force push** - After review starts, use new commits

---

## Communication Guidelines

### Language & Tone

**Good Examples:**

> "In `LeadEditForm.tsx` line 52, consider renaming `data` to `formData` for clarity. This follows our naming convention in 12-CONTRIBUTING.md."

> "Nice solution! One suggestion: could we extract this logic into a reusable hook? It might help with future features."

> "I'm not familiar with this pattern. Could you explain why we're using `useMemo` here?"

**Bad Examples:**

> ❌ "This is wrong."  
> ❌ "Why did you do it this way?"  
> ❌ "Just use a hook."  
> ❌ "LGTM" (without reading)

### Emoji Usage

Use emojis to convey tone and soften feedback:

- 🤔 "Thinking about this..."
- 💡 "Suggestion:"
- ⚠️ "Potential issue:"
- ✅ "Looks good!"
- 🎉 "Great solution!"
- 📚 "Reference:"

---

## Conflict Resolution

### If You Disagree

1. **Discuss first** - Start a conversation in the PR
2. **Reference docs** - Link to `Crm-Documentation/` or style guides
3. **Seek third opinion** - Tag another reviewer
4. **Escalate if needed** - Move to team discussion
5. **Document decision** - Update docs with the outcome

### If Someone Violates Code of Conduct

1. **Assume positive intent** - Maybe it was unintentional
2. **Address privately** - DM before public callout
3. **Be specific** - Point to exact behavior, not person
4. **Suggest alternative** - "Instead of X, try Y"
5. **Report if serious** - Contact project maintainers

---

## Review SLAs (Service Level Agreements)

### Response Times

| Priority           | First Response | Complete Review |
| ------------------ | -------------- | --------------- |
| **P-0 (Critical)** | 4 hours        | 1 day           |
| **P-1 (High)**     | 1 day          | 2 days          |
| **P-2 (Medium)**   | 2 days         | 5 days          |
| **P-3 (Low)**      | 3 days         | 1 week          |

**Note:** "First response" means acknowledging the PR, even if full review comes later.

### Reviewer Responsibilities

- Check notifications at least once per workday
- Comment on blockers immediately
- Approve or request changes within SLA
- Re-review promptly after changes

---

## Scope of Code Review

### What to Review (Checklist from André Girol)

1. **Design** - Is the solution appropriate?
2. **Functionality** - Does it work? Is it good for users?
3. **Complexity** - Can it be simpler?
4. **Tests** - Are there good tests?
5. **Naming** - Are names OBVIOUS?
6. **Comments** - Clear and useful?
7. **Style** - Follows guide?
8. **Documentation** - Updated?
9. **Security** - No leaked credentials?
10. **Database** - Migrations correct?

### What NOT to Review

- Auto-fixable style issues (let ESLint/Prettier handle it)
- Personal preferences not in style guide
- Refactoring unrelated to the PR
- Architecture changes (discuss separately)

---

## Enforcement

### Light Violations

- Gentle reminder in PR comments
- Link to this Code of Conduct
- Encourage better practices

### Serious Violations

- Private conversation with author
- Temporary review privileges suspended
- Required to read communication guidelines

### Repeated Violations

- Discussion with project maintainers
- Formal warning
- Potential removal from project

---

## Credits & Inspiration

This Code of Conduct is based on:

- **André Girol's Code Review presentation** - Culture-first approach
- **Google's Engineering Practices** - Small CLs principle
- **Contributor Covenant** - Standard CoC template
- **Our team values** - Kindness, clarity, mentorship

---

## Questions?

If you have questions about this Code of Conduct:

1. Check `Crm-Documentation/12-CONTRIBUTING.md`
2. Review the PR template checklist
3. Ask in project discussions
4. Contact project maintainers

---

**Remember:** We're all here to build great software together. Code review is how we learn, teach, and improve. Let's make it a positive experience for everyone! 🚀

**Last Updated:** 2025-10-24
