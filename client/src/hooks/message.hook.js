import {useCallback} from 'react'

export const useMessage = () => {
    return useCallback((text) => {
        //Если объект "М" существует и мы передали текст
        if (window.M && text) {
            window.M.toast({html: text});
        }
    }, [])
}
