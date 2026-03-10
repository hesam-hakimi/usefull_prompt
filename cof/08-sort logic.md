Update the Confluence search implementation so results are re-ranked client-side.

Goal:
Pages whose query matches the title should rank above pages whose query only matches page text/body.

Requirements:
1. Run two searches:
   - title search using CQL field `title`
   - text search using CQL field `text`
2. Restrict both searches to:
   - type = page
   - status = current
   - configured allowed spaces unless all-spaces mode is enabled
3. Merge both result sets by page id
4. Add a `source` field:
   - "title"
   - "text"
   - "both"
5. Score results with higher priority for title matches than text matches
6. Sort final results descending by score
7. Write the ranked output to the extension Output channel
8. Keep the ranking logic in a separate reusable module, for example:
   - src/confluence/ranking.ts
9. Add unit tests for:
   - exact title match beats body-only match
   - both match beats text-only match
   - dedupe works correctly
   - recent title match still ranks below exact title match if score is lower

Suggested scoring:
- exact phrase in title: +100
- all terms in title: +70
- partial title match: +40
- exact phrase in excerpt/body: +25
- all terms in excerpt/body: +15
- source=both bonus: +20
- recent update bonus: optional small bonus

Implementation notes:
- Do not rely on Confluence default result ordering for title-vs-body priority
- Keep search settings configurable at extension level
- Preserve logging
