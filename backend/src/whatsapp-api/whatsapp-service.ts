import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import pino from 'pino';
import qrcode from 'qrcode-terminal';

let sock:any = null;



// initialize whatsapp 
export async function initWhatsapp() {
    console.log("🔄 WhatsApp initialize ho raha hai...");
    
    // 1. Auth state load karo
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    // 2. Socket banao (printQRInTerminal hata diya hai warning hatane ke liye)
    sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' })
    });

    // 3. Events handle karo
    sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        // 🔥 QR Code ko khud se terminal me print karna
        if (qr) {
            console.log("\n📱 QR Code scan karo (WhatsApp > Linked Devices > Link a Device):");
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log("✅ WhatsApp successfully connected!");
            console.log(`📞 Logged in as: ${sock.user?.name || 'Unknown'} (${sock.user?.id})`);
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            console.log(`❌ Connection closed. Status: ${statusCode}`);
            
            if (shouldReconnect) {
                console.log("🔄 Reconnecting...");
                await initWhatsapp(); // Auto reconnect
            } else {
                console.log("⚠️ Logged out (Status 401)! Purana session khatam ho gaya hai.");
                console.log("👉 'auth_info' folder delete karo aur server dobara start karo.");
            }
        }
    });

    // 4. Credentials save karo
    sock.ev.on('creds.update', saveCreds);
}


export async function  sendMessage(phoneNumber:any,message:string){

        if (!sock) {
        throw new Error("❌ WhatsApp service initialized nahi hai!");
    }

    if (!sock.user) {
        throw new Error("❌ WhatsApp connected nahi hai! QR code scan karo.");
    }


    try {
        // 2. Phone number ko WhatsApp JID format me convert karo
        // Example: "919876543210" -> "919876543210@s.whatsapp.net"
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, ''); // Sirf numbers rakho
        const jid = `${cleanNumber}@s.whatsapp.net`;

            await sock.sendMessage(jid, { text: message });
        
        console.log(`✅ Message successfully sent to ${phoneNumber}`);
        return { success: true, message: "Message sent" };

    }catch(error:any){
            console.error(`❌ Failed to send message to ${phoneNumber}:`, error.message);
        throw new Error(`Message send karne me error: ${error.message}`);
    }
}   