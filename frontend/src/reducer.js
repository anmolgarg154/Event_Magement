let obj={
    islogin:0, 
    profile:{}
}

export function appReducer(state=obj,action){
    
    if(action.type=="setLogin"){
        return {...state,islogin:action.value}
    }
    else if(action.type=="setProfile")
    {
        return {...state,profile:action.value};
    }
    else{
        return state;
    }
}