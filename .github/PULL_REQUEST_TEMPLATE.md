# Pull Request

## 📋 Description

<!-- Provide a clear and detailed description of what this PR does -->

### What does this PR do?

### Why is this change needed?

### What problem does it solve?

---

## 🎯 Type of Change

<!-- Mark the appropriate option with an 'x' -->

- [ ] 🐛 **Bug fix** (non-breaking change that fixes an issue)
- [ ] ✨ **New feature** (non-breaking change that adds functionality)
- [ ] 💥 **Breaking change** (fix or feature that breaks existing functionality)
- [ ] 📝 **Documentation update** (changes to documentation only)
- [ ] 🎨 **Style/Refactor** (formatting, renaming, no functional changes)
- [ ] ⚡ **Performance improvement** (code changes that improve performance)
- [ ] 🧪 **Test** (adding or updating tests)
- [ ] 🔧 **Chore** (dependency updates, build config, etc.)

---

## ✅ Code Review Checklist

Based on [André Girol's Code Review principles](https://docs.google.com/presentation/d/1DE6yqBJUAH42RI-q9K3ruQqi2qPiUwgrM8qeQeSxlMo/edit), reviewers should verify:

### 1. Design

- [ ] **Is the solution appropriate for this project?**
- [ ] Does it fit the overall architecture documented in `Crm-Documentation/02-ARCHITECTURE.md`?
- [ ] Are there any alternative approaches that should be considered?

### 2. Functionality

- [ ] **Does the code do what it's supposed to do?**
- [ ] Is this good for the user/business?
- [ ] Are edge cases handled properly?
- [ ] Does it match the acceptance criteria?

### 3. Complexity

- [ ] **Is there any over-engineering?**
- [ ] Could this be simpler?
- [ ] Will the next developer understand this code easily?
- [ ] Are complex sections properly documented?

### 4. Tests

- [ ] **Are there automated tests?**
- [ ] Do tests cover the critical paths?
- [ ] Are tests well-architected and maintainable?
- [ ] Do all existing tests still pass?

### 5. Naming

- [ ] **Are names OBVIOUS?**
- [ ] Do variable, function, and class names clearly express their purpose?
- [ ] Do they follow the project's naming conventions?
- [ ] Could any names be more descriptive?

### 6. Comments

- [ ] **Are comments clear and useful?**
- [ ] Do they explain WHY, not WHAT?
- [ ] Could any comment be replaced with better variable/function names?
- [ ] Are there any outdated comments?

### 7. Style

- [ ] **Does the code follow the style guide?**
- [ ] Does ESLint pass without warnings?
- [ ] Is the code formatted with Prettier?
- [ ] Are imports organized correctly?

### 8. Documentation

- [ ] **Is relevant documentation updated?**
- [ ] Are API changes reflected in `03-API-REFERENCE.md`?
- [ ] Are new components documented in `04-COMPONENTS.md`?
- [ ] Are breaking changes noted in commit messages?

### 9. Security

- [ ] **No credentials or secrets leaked?**
- [ ] Are environment variables used for sensitive data?
- [ ] Are there any SQL injection risks?
- [ ] Is user input properly validated?

### 10. Database

- [ ] **Are migrations properly generated?**
- [ ] Do RLS policies protect data correctly?
- [ ] Are triggers behaving as expected?
- [ ] Is `updated_at` **NOT** sent manually in UPDATE payloads?

---

## 🧪 Testing

### Manual Testing Completed

<!-- Describe how you tested this change -->

- [ ] Tested on Chrome (desktop)
- [ ] Tested on Firefox (desktop)
- [ ] Tested on Safari (desktop)
- [ ] Tested on mobile (Chrome/Safari)
- [ ] Tested with different user roles/permissions

### Automated Tests

<!-- Mark what's included -->

- [ ] Unit tests added/updated (Vitest)
- [ ] E2E tests added/updated (Playwright)
- [ ] All tests pass locally (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)

### Test Coverage

<!-- If applicable, mention coverage % or critical paths covered -->

---

## 📸 Screenshots/Recordings

<!-- Add screenshots or screen recordings showing the changes -->
<!-- For UI changes, include before/after comparisons -->

### Before

### After

---

## 🔗 Related Issues

<!-- Link to related issues, bugs, or feature requests -->

- Fixes #
- Related to #
- Closes #

### Bug Fixes

<!-- If this fixes a documented bug, reference it -->

- [ ] This fixes a bug documented in `06-BUGS-AND-FIXES.md`
  - Bug ID: #
  - Priority: P-0 / P-1 / P-2 / P-3

---

## 📝 Known Issues & Limitations

<!-- Be honest about any known issues or limitations -->

### Known Issues Introduced

<!-- List any new known issues this PR introduces -->

- None

### Known Issues NOT Fixed

<!-- List any related issues that are NOT fixed by this PR -->

- None

### Technical Debt

<!-- Any technical debt this PR creates that should be addressed later -->

- None

---

## 🚀 Deployment Notes

<!-- Any special deployment considerations? -->

### Database Migrations Required?

- [ ] Yes - Migration files included
- [ ] No

### Environment Variables Changed?

- [ ] Yes - Update `.env.local` with:
  ```
  VARIABLE_NAME=value
  ```
- [ ] No

### Breaking Changes?

- [ ] Yes - See migration guide below
- [ ] No

### Migration Guide

<!-- If there are breaking changes, how should users migrate? -->

### Rollback Plan

<!-- How to rollback if this goes wrong in production -->

---

## 📦 Dependencies

<!-- List any new dependencies added -->

### New Dependencies Added

- None

### Dependencies Updated

- None

### Why These Dependencies?

<!-- Justify new dependencies: Why not alternatives? What problem do they solve? -->

---

## ⚡ Performance Impact

<!-- Any performance considerations? -->

- [ ] No performance impact
- [ ] Performance improved (describe how)
- [ ] Performance degraded (justify why)

### Metrics

<!-- If applicable, include before/after metrics -->

---

## 🎯 Acceptance Criteria

<!-- Define what "done" means for this PR -->

- [ ] Feature works as described
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Code reviewed and approved
- [ ] Ready to merge

---

## 💬 Additional Context

<!-- Any additional information reviewers should know -->

---

## 📚 References

<!-- Links to relevant documentation, designs, discussions -->

- Crm-Documentation: See `Crm-Documentation/`
- Design:
- Discussion:
- External docs:

---

## ✍️ Author Checklist

**Before requesting review, I have:**

- [ ] Written clear commit messages following Conventional Commits
- [ ] Self-reviewed my code for obvious errors
- [ ] Added comments for complex logic
- [ ] Updated relevant documentation
- [ ] Added/updated tests for my changes
- [ ] Verified all tests pass locally
- [ ] Checked for console errors/warnings
- [ ] Tested on multiple browsers (if UI change)
- [ ] Verified mobile responsiveness (if UI change)
- [ ] No credentials or secrets in code
- [ ] Followed the project's code style
- [ ] Kept changes small and focused (Small CLs principle)

---

## 👥 Reviewer Guidelines

### For Reviewers

**Response Time:**

- ⏰ **Respond within 1 business day** (even if just acknowledging)
- 💬 First response is more important than complete review

**Communication:**

- 🤝 Be kind and constructive
- 📍 Be precise: "In method X, line Y, rename variable Z to..."
- 🎓 Use reviews as mentoring opportunities
- 🎉 Praise interesting solutions
- 💡 Explain WHY changes are needed, not just WHAT

**What to Avoid:**

- ⚠️ Nitpicking on auto-fixable issues (let linters handle it)
- 🚫 "Looks good to me" without actually reading
- 👥 Herd mentality (review independently)
- 💼 Power dynamics (focus on code, not person)

### For Authors

**Responding to Feedback:**

- 💬 Don't take it personally - "Your code doesn't define you as a person"
- ✍️ Write detailed PR descriptions
- 📦 Submit small, focused PRs (easier to review)
- 🙏 Thank reviewers for their time
- 🤔 Consider all feedback carefully

---

## 🏷️ Labels

<!-- Add appropriate labels -->

- Priority: `P-0` / `P-1` / `P-2` / `P-3`
- Type: `bug` / `feature` / `docs` / `chore`
- Status: `ready-for-review` / `work-in-progress` / `blocked`

---

**Remember:** Code Review is Culture, not bureaucracy. It's about knowledge sharing, quality assurance, and building better software together. 🚀
