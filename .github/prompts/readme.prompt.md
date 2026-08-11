---
agent: agent
---

# README Maintenance - Taxibrousse
**Note:** Keep README edits minimal and target only affected sections. Call out `VITE_*` env changes and breaking API or DB changes explicitly.

## Agent Instructions

- Keep diffs minimal; update only affected sections
- Reuse existing templates; avoid reformatting unrelated parts  
- Provide smallest working examples with positive condition patterns
- Call out new `VITE_*` env vars and breaking changes explicitly
- Document interface-based controller patterns for backend
## When to Update Documentation

### Trigger Events
- New feature added
- Feature modified or removed
- Configuration changes (env vars)
- API changes
- Database changes
- Dependency changes

## Update Strategy

### For New Features
1. Add to main feature list
2. Update tech stack if new dependencies
3. Add configuration examples
4. Document API endpoints
5. Update getting started if setup changes

### For Modified Features
1. Update feature descriptions
2. Modify configuration examples
3. Update API documentation
4. Refresh code examples

### For Removed Features
1. Remove from feature list
2. Remove configuration examples
3. Remove API documentation
4. Update project structure

## Sections to Maintain

| Section | When to Update |
|---------|----------------|
| Tech Stack | New libraries, version updates |
| Key Features | Feature changes |
| Getting Started | Setup changes |
| Configuration | New env vars |
| API Endpoints | Endpoint changes |
| Project Structure | Directory changes |

## Documentation Standards

### Code Examples
```bash
# Always test examples
./mvnw spring-boot:run
cd front && npm run dev
cd cms && npm run develop
```

### Configuration Examples
```env
# Include all required vars
VITE_API_URL=http://localhost:8080/api
VITE_CMS_API_URL=http://localhost:1337/api
VITE_CMS_API_KEY=your_api_key
```

## Validation Checklist

- [ ] Code examples tested and working
- [ ] Links point to existing files
- [ ] Configuration matches implementation
- [ ] New features follow existing patterns
- [ ] Removed features cleaned from docs

## Integration Points

- Project structure: `copilot-instructions.md`
- Development workflow: `dev.prompt.md`
- Label keys: `label.prompt.md`
- Dynamic sections: `README-DYNAMIC-PAGES.md`
