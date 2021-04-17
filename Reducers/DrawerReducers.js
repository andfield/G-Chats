//Create LocalStorage for the current drawer status this storage is then excessed by the Context.
const Storage = (drawerStatus) => {
    localStorage.setItem('drawerStatus', JSON.stringify(drawerStatus))
}


//Create and export DrawerReducers.
export const DrawerReducers = (state, action) => {

    Storage(state.drawerStatus)

    switch (action.type) {
        case 'CURRENT_STATUS':
            return{
                state
            }
        case 'CHANGE_STATUS':
            state.drawerStatus = action.payload
            return {
                ...state
            }

        default:
            state
    }

}
