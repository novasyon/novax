/**
* Convert seconds to time string (YYYY-MM-DD).
* YYYY-MM-DDTHH:mm:ss.sssZ
* @param Number s 
*
* @return String
*/
export function time(s) {
    return new Date(s * 1e3).toISOString().slice(0, -14);
}