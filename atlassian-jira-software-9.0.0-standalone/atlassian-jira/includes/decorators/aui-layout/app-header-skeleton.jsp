<svg class="aui-header-primary" width="600" height="40" xmlns="http://www.w3.org/2000/svg">
    <style type="text/css">
        #mask {
            animation: mask 0.8s forwards linear infinite;
        }

        @keyframes mask {
            from {
                transform: translateX(0)
            }
            to {
                transform: translateX(600px)
            }
        }
    </style>
    <defs>

        <mask id="other-element">

            <rect height="24" width="24" y="8" x="8" rx="2" fill="#556E9E"/>
            <rect height="24" width="70" y="8" x="38" rx="2" fill="#556E9E"/>
            <rect height="12" width="92" y="12.5" x="114" rx="2" fill="#556E9E"/>
            <rect height="12" width="92" y="12.5" x="212" rx="2" fill="#556E9E"/>
            <rect height="12" width="92" y="12.5" x="310" rx="2" fill="#556E9E"/>
            <rect height="12" width="92" y="12.5" x="408" rx="2" fill="#556E9E"/>
            <rect height="24" width="70" y="8" x="506" rx="2" fill="#556E9E"/>
            <rect fill="hsla(200,0%,10%,.2)" id="mask" width="140" height="35"/>

        </mask>

    </defs>

    <rect mask="url(#other-element)" height="24" width="24" y="8" x="8" rx="2" fill="#dadada"/>
    <rect mask="url(#other-element)" height="24" width="70" y="8" x="38" rx="2" fill="#dadada"/>
    <rect mask="url(#other-element)" height="12" width="92" y="12.5" x="114" rx="2" fill="#dadada"/>
    <rect mask="url(#other-element)" height="12" width="92" y="12.5" x="212" rx="2" fill="#dadada"/>
    <rect mask="url(#other-element)" height="12" width="92" y="12.5" x="310" rx="2" fill="#dadada"/>
    <rect mask="url(#other-element)" height="12" width="92" y="12.5" x="408" rx="2" fill="#dadada"/>
    <rect mask="url(#other-element)" height="24" width="70" y="8" x="506" rx="2" fill="#dadada"/>

</svg>
<svg class="aui-header-secondary" width="356" height="40" xmlns="http://www.w3.org/2000/svg">
    <style type="text/css">
        #mask {
            animation: mask 0.8s forwards linear infinite;
        }

        @keyframes mask {
            from {
                transform: translateX(0)
            }
            to {
                transform: translateX(500px)
            }
        }
    </style>
    <defs>

        <mask id="mask-element">

            <rect height="24" width="184" y="8" x="7" rx="2" fill="#556E9E"/>
            <rect height="24" width="24" y="8" x="209" rx="2" fill="#556E9E"/>
            <rect height="24" width="24" y="8" x="251" rx="2" fill="#556E9E"/>
            <rect height="24" width="24" y="8" x="293" rx="2" fill="#556E9E"/>
            <rect fill="hsla(200,0%,10%,.2)" id="mask" width="50" height="35"/>

        </mask>

    </defs>

    <rect mask="url(#mask-element)" height="24" width="184" y="8" x="7" rx="2" fill="#dadada"/>
    <rect mask="url(#mask-element)" height="24" width="24" y="8" x="209" rx="2" fill="#dadada"/>
    <rect mask="url(#mask-element)" height="24" width="24" y="8" x="251" rx="2" fill="#dadada"/>
    <rect mask="url(#mask-element)" height="24" width="24" y="8" x="293" rx="2" fill="#dadada"/>
</svg>
