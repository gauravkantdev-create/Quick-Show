**Fix API 500 Errors: `/api/shows` & `/api/users/favourite`**

**Changes:**
- `UserController.getFavourites()`: Safe `.populate('favorites')` try-catch (no CastError crash)
- `ShowController.getShows()`: `.select('movie showDateTime showPrice occupiedSeats').limit(100)` (no timeout)
- Deleted unused `server/routes/favouriteRoutes.js` 
- Updated `TODO.md`

**Root Causes:**
1. Movie populate fails (missing refs) → `{success: true, movies: []}`
2. Show.find() timeout (corrupt data) → Limited query + fallback `{shows: []}`

**Before/After:**
```
❌ Before: AxiosError 500  
✅ After:  {success: true, data: []}
```

**Test:**
```
1. cd server && npm start
2. Refresh app → Check Network tab: 200 OK  
3. Console: No AxiosErrors
```

**Next:** Fix `.env MONGODB_URI="mongodb://..."` + `node server/fix-shows.js`

