"use client"

import { useEffect, useState } from "react";

export default function Accounts() {
    const [account, setAccount] = useState()

    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:3000/v1/github")

            const data = await response.json()

            console.log(data)
            setAccount(data)
        })()
    }, [])

    useEffect(() => {
        if (account) {
            console.log(account)
        }
    }, [account])

    return (
        <main>
            <div>Accounts</div>
        </main>
    );
}
