import {useState, useCallback} from 'react';

//Работаем с асинхронными запросами на сервер
export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);

        try {

            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }
            console.log('hook11')
            console.log('method:', method)
            console.log('body', body)
            console.log('headers', headers)
            console.log('url', url)
            const response = await fetch(url, {method, body, headers});
            console.log('hook2')
            const data = await response.json();
            console.log('hook3')
            if (!response.ok) {
                throw new Error(data.message || 'Что то пошло не так');
            }
            setLoading(false);

            return data;
        } catch (e) {

            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [])

    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError };
}
