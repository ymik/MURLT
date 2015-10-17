URL tracker for messengers

How to use?

Base usage: simple include this code into your HTML
<script language="JavaScript" src="murlt.js"></script>

How to track your users?

<script language="JavaScript">
window.murltFingerprint = 'put your user fingerprint here; it can be session ID or user ID';
</script>
<script language="JavaScript" src="murlt.js"></script>



If you haven't user fingerprint you also may use MURLT with Fingerprint2 library (https://github.com/Valve/fingerprintjs2).
In that case you need simple include the Fingerprint2 library _above_ MURLT.

Script will automatically set window.murltFingerprint to Fingerprint2 hash.:

<script src="http://cdn.jsdelivr.net/fingerprintjs2/0.8.0/fingerprint2.min.js"></script>
<script language="JavaScript" src="murlt.js"></script>



How to read MURLT hash?

Script includes MURLT hash into browser URL string as CGI GET parameter.
The parameter starts with letters "murlt". Then it continues with base64-encoded hash digits where last 4 bytes is a UNIX timestamp in seconds (time gets from the client-side).
