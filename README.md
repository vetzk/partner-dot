# partner-dot

Dalam project ini saya menggunakan Service Layer Pattern untuk menangani logika bisnis secara lebih terorganisir dan dapat dimaintain dengan baik. Pada pattern tersebut logika bisnis diringkas menjadi service terpisah yang kemudian dapat dipanggil dari controller. Pola ini memisahkan antara logika bisnis dan presentasi untuk meningkatkan modularitas dan skalabilitas.

Saya menggunakan Service Layer Pattern karena pattern ini dapat memisahkan logika bisnis dari logika controller dimana controller akan berfokus pada task yang berhubungan dengan HTTP seperti menangani request dan response. Selain itu pattern ini mendukung reusability dimana logika bisnis di services dapat digunakan ulang pada beberapa controller atau services lain tanpa perlu duplikasi. Keuntungan lain adalah mudah untuk dimaintain sehingga meningkatkan organisasi kode atau dengan kata lain membuat kode jadi mudah dibaca dan mudah untuk melakukan testing
