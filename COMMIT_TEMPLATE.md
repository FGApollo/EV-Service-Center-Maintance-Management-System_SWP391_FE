# Git Commit Template

## Commit này để commit

```bash
git add .

git commit -m "fix(manager): Update user API endpoint and improve error handling

- Fixed: /api/update/{id} → /api/auth/update/{id} per OpenAPI spec
- Added: Token expiry detection with auto-logout (403/401)
- Added: Permission denied error handling
- Improved: User-friendly error messages for all operations
- Added: Complete CRUD documentation (MANAGER_FULL_CRUD_GUIDE.md)
- Added: Implementation status report (MANAGER_IMPLEMENTATION_COMPLETE.md)
- Added: Code review checklist (CODE_REVIEW_CHECKLIST.md)
- Verified: No hardcoded values or credentials
- Verified: All API endpoints aligned with OpenAPI v1

Changes:
- src/api/index.js: Fixed updateUser endpoint
- src/pages/ManagerDashboard.jsx: Enhanced error handling
- Documentation: Added 3 comprehensive guides

Tested:
✅ Customer CRUD operations
✅ Vehicle CRUD operations
✅ Error handling for token expiry
✅ Error handling for permission denied
✅ All API endpoints functional
✅ Dashboard overview with real-time data

Breaking Changes: None
Backward Compatible: Yes"

git push origin manager
```

## Hoặc commit ngắn gọn hơn

```bash
git add .

git commit -m "fix(manager): Update API endpoint and error handling

- Fixed: updateUser endpoint to /api/auth/update/{id}
- Added: Token expiry handling with auto-logout
- Added: Comprehensive error messages
- Added: Complete documentation

Verified: No hardcoded values, all endpoints correct"

git push origin manager
```

## Kiểm tra trước khi commit

```bash
# Check files changed
git status

# Review changes
git diff

# View staged changes
git diff --staged
```

## Sau khi commit

```bash
# View commit history
git log --oneline -5

# View last commit details
git show HEAD
```

---

**Note**: Chọn commit message phù hợp với quy chuẩn của team bạn.
