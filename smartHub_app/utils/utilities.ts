
const config = {
    address: "lukessmarthub.ddns.net",
    port: 4000
}

//export default 
export function getLocalAddress() {
    return config.address;
}

export function getLocalPort() {
    return config.port;
}

export function getAddressString() {
    return "http://" + config.address + ":" + config.port;
}


