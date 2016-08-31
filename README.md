# Tanda-Translink-Maps-Uber

## Find your optimal route to work

Get your shifts straight from Tanda.  Find what time you need to leave home, and know which bus to 
take.

## Breakdown

### Tanda

- Get rosters from Tanda
- Store the rosters

### Maps

- Find the location of the house (maybe current location)
- Probably just need LatLongs

### Translink

- See [here](https://opia.api.translink.com.au/v2/content/swaggerui/index.aspx) for API 
documentation


### Uber

- Find the trip time and cost for Uber.


## Plan Of Attack

### User Side

- [x] Sign up.
- [x] Sign in.
- [x] Provide a way to link Tanda account
- [ ] Provide a way to link Uber account

### Tanda

- [x] Get a user's roster
    - [ ] Store it
- [x] Find the location of the business

### Web

- [ ] Find the user's current location
- [ ] Display a notification when it's time to leave

### Translink

- [ ] Find the best route from the user's location to the business
- [ ] Find the time of the bus
- [ ] Find the cost of the trip

### Uber

- [ ] Get trip details between two points


## Account Info

### API Application Open

email: david@tanda.co

password: lastpass

### Organisation Account

email: cab432org@example.com

password: cab432mashup

### Employee

email: cab432@example.com

password: cab432mashup