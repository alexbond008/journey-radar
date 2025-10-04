# Bug Fixes Summary - Event Rating & Route Finding

## Date: October 4, 2025

## Issues Fixed

### 1. Event Rating/Voting Not Working ✅

**Problem:**
- Frontend was sending `eventId` and `userId` as strings in camelCase
- Backend `EventVote` model was expecting `eventid` and `userid` as integers in lowercase
- Type mismatch and field name mismatch caused voting to fail

**Solution:**
- Updated `EventVote` model in `database_models.py`:
  ```python
  class EventVote(BaseModel):
      eventId: str  # Changed from eventid: int
      userId: str   # Changed from userid: int
      voteType: str
  ```
- Modified `vote_event` endpoint to convert string IDs to integers for comparison:
  ```python
  event_id_int = int(vote_data.eventId)
  event = next((e for e in EVENTS_STORAGE if e.id == event_id_int), None)
  ```
- Applied same fix to `resolve_event` endpoint

**Testing:**
- ✅ Created test event (ID: 1)
- ✅ Successfully upvoted (upvotes: 0 → 1)
- ✅ Successfully downvoted (downvotes: 0 → 1)

### 2. Route Finding Not Working ✅

**Problem:**
- Frontend expected routes with `stops` array populated
- Backend was returning `Line` objects with only `edges` (Edge IDs)
- Missing `number` field required by frontend
- Route finding component couldn't match stops because stops array was empty

**Solution:**
- Added `number` and `stops` fields to `Line` model:
  ```python
  class Line(BaseModel):
      id: int
      name: str
      number: Optional[str] = None
      edges: list[Edge]
      stops: Optional[List[Stop]] = None
  ```
- Updated all line definitions in `dicts.py` to include `number` field:
  ```python
  lines = {
      1: Line(id=1, name="Linia Oświęcim - Kraków", number="1", edges=[...]),
      2: Line(id=2, name="Linia Miechów - Kraków Lotnisko", number="2", edges=[...]),
      ...
  }
  ```
- Modified `get_all_lines` endpoint to populate stops from edges:
  ```python
  # Extract stops from edges
  line_stops = []
  first_stop = stops.get(first_edge.from_stop)
  line_stops.append(first_stop)
  
  for edge in line.edges:
      to_stop = stops.get(edge.to_stop)
      line_stops.append(to_stop)
  ```

**Testing:**
- ✅ GET `/info/get_lines` now returns complete route data
- ✅ Each route includes: id, name, number, edges, and stops array
- ✅ All 4 lines return with complete stop information
- ✅ Route finding can now match stops by ID

## Files Modified

### Backend Files:
1. `/fastapi_app/models/database_models.py`
   - Updated `EventVote` model field names and types
   - Added `number` and `stops` fields to `Line` model

2. `/fastapi_app/routers/info_route.py`
   - Fixed `vote_event` endpoint with type conversion
   - Fixed `resolve_event` endpoint with type conversion
   - Enhanced `get_all_lines` to populate stops
   - Updated `get_all_line_numbers` endpoint
   - Added type annotation to `EVENTS_STORAGE`

3. `/fastapi_app/db/dicts.py`
   - Added `number` field to all line definitions

## API Response Examples

### GET /info/get_lines (sample)
```json
{
  "id": 1,
  "name": "Linia Oświęcim - Kraków",
  "number": "1",
  "edges": [...],
  "stops": [
    {"id": 1, "code": "OSW01", "name": "OŚWIĘCIM", ...},
    {"id": 2, "code": "DWORY", "name": "DWORY", ...},
    ...
  ]
}
```

### POST /info/vote_event
**Request:**
```json
{
  "eventId": "1",
  "userId": "test_user_123",
  "voteType": "upvote"
}
```

**Response:**
```json
{
  "id": 1,
  "upvotes": 1,
  "downvotes": 0,
  ...
}
```

## Frontend Compatibility

Both endpoints now return data in the exact format expected by the frontend:
- ✅ Routes include `stops` array for route finding
- ✅ Routes include `number` field for display
- ✅ Event voting accepts string IDs from frontend
- ✅ Event voting returns updated event with vote counts

## Testing Recommendations

1. **Event Voting:**
   - Test upvoting from incident detail modal
   - Test downvoting from incident detail modal
   - Verify vote counts update in real-time
   - Check that vote percentages display correctly

2. **Route Finding:**
   - Open route selector panel
   - Search for start stop (e.g., "OŚWIĘCIM")
   - Search for destination stop (e.g., "KRAKÓW GŁÓWNY")
   - Click "Find Routes" button
   - Verify matching routes appear
   - Click on a route to select it

## Notes

- Event voting is currently stored in memory (EVENTS_STORAGE)
- In production, implement proper database storage
- Consider adding vote tracking per user to prevent multiple votes
- Route finding is client-side; consider backend endpoint for complex queries

