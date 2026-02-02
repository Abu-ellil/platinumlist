import '../../../globals.css'

export default function TicketsLayout({ children }) {
    return (
        <>
            <link href="https://cdn.platinumlist.net/dist/v800/css-compiled-mobile/transitional.css" media="screen and (max-width: 767px)" rel="stylesheet" type="text/css" />
            <link href="https://cdn.platinumlist.net/dist/v800/css-compiled/transitional.css" media="screen and (min-width: 768px)" rel="stylesheet" type="text/css" />
            <link href="https://cdn.platinumlist.net/dist/v800/css-mobile/hall-map.css" media="screen and (max-width: 767px)" rel="stylesheet" type="text/css" />
            <link href="https://cdn.platinumlist.net/dist/v800/css/hall-map.css" media="screen and (min-width: 768px)" rel="stylesheet" type="text/css" />
            <link href="https://cdn.platinumlist.net/dist/v800/css-mobile/event/ticket-office.css" media="screen and (max-width: 767px)" rel="stylesheet" type="text/css" />
            <link href="https://cdn.platinumlist.net/dist/v800/css/event/ticket-office.css" media="screen and (min-width: 768px)" rel="stylesheet" type="text/css" />
            <link href="https://cdn.platinumlist.net/dist/v800/css-mobile/hall-map/ticket-office.css" media="screen and (max-width: 767px)" rel="stylesheet" type="text/css" />
            <link href="https://cdn.platinumlist.net/dist/v800/css/hall-map/ticket-office.css" media="screen and (min-width: 768px)" rel="stylesheet" type="text/css" />
            <link href="https://use.typekit.net/asc5yyb.css" media="screen" rel="stylesheet" type="text/css" />
            {children}
        </>
    );
} 