import TopMenu from "../components/TopMenu"
import Footer from "../components/Footer"

import CssBaseline from "@material-ui/core/CssBaseline"
import Head from 'next/head';

import React from "react"
export default function FrontendLayout({ children }) {
    return (
        <React.Fragment >
            <Head>
                <link rel="favicon icon" href="favicon.ico" />
            </Head>
            <CssBaseline />
            <TopMenu />
                {children}
            <Footer />
        </React.Fragment>
    )

}