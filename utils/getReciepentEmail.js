//Taking array taking user who is logged in and 
//return a string of email who is the current user
// is takling to.

const getReciepectEmail = (users, userLoggedIn) => (
    users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0]
)

export default getReciepectEmail
