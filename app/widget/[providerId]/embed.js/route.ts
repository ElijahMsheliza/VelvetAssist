export async function GET(_req: Request, { params }: { params: Promise<{ providerId: string }> }) {
    const { providerId } = await params;
    
    // The base URL of our SaaS
    const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const scriptCode = `
(function() {
    if (document.getElementById('velvet-assist-widget')) return;

    var style = document.createElement('style');
    style.innerHTML = \`
        #velvet-assist-widget-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #C9A27E;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        #velvet-assist-widget-btn:hover {
            transform: scale(1.05);
        }
        #velvet-assist-widget-btn svg {
            width: 30px;
            height: 30px;
            fill: none;
            stroke: #18181b; /* zinc-950 */
            stroke-width: 2;
        }
        #velvet-assist-widget-frame {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 600px;
            border: none;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 999999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            max-height: calc(100vh - 110px);
            max-width: calc(100vw - 40px);
            background: #18181b;
        }
        #velvet-assist-widget-frame.velvet-open {
            display: block;
            opacity: 1;
        }
    \`;
    document.head.appendChild(style);

    var btn = document.createElement('div');
    btn.id = 'velvet-assist-widget-btn';
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';
    document.body.appendChild(btn);

    var iframe = document.createElement('iframe');
    iframe.id = 'velvet-assist-widget-frame';
    iframe.src = '${host}/widget/${providerId}';
    iframe.allow = 'microphone; camera';
    document.body.appendChild(iframe);

    var isOpen = false;
    btn.addEventListener('click', function() {
        isOpen = !isOpen;
        if (isOpen) {
            iframe.classList.add('velvet-open');
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
        } else {
            iframe.classList.remove('velvet-open');
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';
        }
    });
})();
    `;

    return new Response(scriptCode, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'public, max-age=3600'
        }
    });
}
