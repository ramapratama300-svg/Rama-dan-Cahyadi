import type { QuizPack } from '../types/quiz';

const IMG_SAINS = '/src/assets/images/sd_kuis_sains_1794817693449.jpg';
const IMG_SEJARAH = '/src/assets/images/sd_kuis_sejarah_1794817692698.jpg';
const IMG_MATEMATIKA = '/src/assets/images/sd_kuis_matematika_1794817693325.jpg';
const IMG_GEOGRAFI = '/src/assets/images/sd_kuis_geografi_1794817694230.jpg';

export const HERO_ILLUSTRATION = '/src/assets/images/sd_hero_belajar_1794817692038.jpg';

export const BUILT_IN_QUIZZES: QuizPack[] = [
  {
    id: 'sains-kelas-3',
    title: 'Sains Seru: Hewan, Tumbuhan & Alam',
    description:
      'Belajar tentang metamorfosis kupu-kupu, bagian tumbuhan, cara hewan bernapas, dan planet di tata surya.',
    category: 'Sains',
    difficulty: 'Dasar',
    estimatedMinutes: 3,
    coverImage: IMG_SAINS,
    questions: [
      {
        id: 'sd-sci-1',
        prompt: 'Sebelum berubah menjadi kupu-kupu yang indah, ulat akan berubah menjadi apa terlebih dahulu?',
        image: IMG_SAINS,
        imageAlt: 'Ilustrasi kupu-kupu, tanaman, dan alam',
        options: ['Berudu', 'Kepompong', 'Telur ayam', 'Belalang'],
        correctIndex: 1,
        explanation:
          'Urutan hidup kupu-kupu dimulai dari telur, lalu menjadi ulat, kemudian membungkus diri menjadi kepompong, dan akhirnya keluar sebagai kupu-kupu.',
      },
      {
        id: 'sd-sci-2',
        prompt: 'Bagian tumbuhan yang berada di dalam tanah dan bertugas menyerap air adalah?',
        options: ['Daun', 'Bunga', 'Akar', 'Buah'],
        correctIndex: 2,
        explanation:
          'Akar tumbuh di dalam tanah untuk menyerap air dan zat makanan, serta membuat tumbuhan berdiri kokoh.',
      },
      {
        id: 'sd-sci-3',
        prompt: 'Ikan dapat berenang dan hidup di dalam air karena bernapas menggunakan?',
        options: ['Paru-paru', 'Insang', 'Sayap', 'Sirip'],
        correctIndex: 1,
        explanation:
          'Ikan bernapas memakai insang untuk mengambil oksigen yang ada di dalam air, sedangkan sirip dipakai untuk berenang.',
      },
      {
        id: 'sd-sci-4',
        prompt: 'Hewan manakah di bawah ini yang termasuk pemakan tumbuhan (herbivora)?',
        options: ['Singa', 'Harimau', 'Kelinci', 'Buaya'],
        correctIndex: 2,
        explanation:
          'Kelinci suka makan wortel, rumput, dan sayur-sayuran, sehingga disebut hewan pemakan tumbuhan.',
      },
      {
        id: 'sd-sci-5',
        prompt: 'Benda manakah yang termasuk benda cair dan bentuknya mengikuti wadahnya?',
        options: ['Batu kerikil', 'Pensil kayu', 'Air minum', 'Penghapus'],
        correctIndex: 2,
        explanation:
          'Air adalah benda cair. Jika dituang ke gelas, bentuknya seperti gelas; jika dituang ke botol, bentuknya seperti botol.',
      },
      {
        id: 'sd-sci-6',
        prompt: 'Pusat tata surya yang memberikan cahaya dan kehangatan bagi Bumi adalah?',
        image: IMG_SAINS,
        imageAlt: 'Ilustrasi matahari dan planet-planet tata surya',
        options: ['Bulan', 'Matahari', 'Bintang jatuh', 'Awan'],
        correctIndex: 1,
        explanation:
          'Matahari adalah bintang besar di pusat tata surya kita yang menyinari Bumi pada siang hari.',
      },
      {
        id: 'sd-sci-7',
        prompt: 'Bagian tubuh yang kita gunakan untuk mencium harum bunga atau aroma masakan ibu adalah?',
        options: ['Telinga', 'Hidung', 'Lidah', 'Kulit'],
        correctIndex: 1,
        explanation:
          'Hidung adalah indera penciuman yang membantu kita mengenali berbagai bau di sekitar kita.',
      },
      {
        id: 'sd-sci-8',
        prompt: 'Agar tubuh kita tetap sehat, kuat, dan tidak mudah haus, setiap hari kita harus rajin minum?',
        options: ['Air putih bersih', 'Sirup manis terus', 'Air laut asin', 'Cairan tinta'],
        correctIndex: 0,
        explanation:
          'Minum air putih yang cukup setiap hari menjaga tubuh tetap segar dan membantu kita berkonsentrasi saat belajar.',
      },
    ],
  },
  {
    id: 'matematika-kelas-3',
    title: 'Matematika & Hitung Cepat Kelas 3',
    description:
      'Latihan berhitung perkalian dasar, membaca jam, mengenal bangun datar, pecahan sederhana, dan teka-teki angka.',
    category: 'Matematika',
    difficulty: 'Dasar',
    estimatedMinutes: 4,
    coverImage: IMG_MATEMATIKA,
    questions: [
      {
        id: 'sd-math-1',
        prompt: 'Ibu membeli 4 kotak pensil warna. Setiap kotak berisi 6 pensil. Berapa jumlah seluruh pensil?',
        image: IMG_MATEMATIKA,
        imageAlt: 'Ilustrasi balok angka dan alat matematika warna-warni',
        options: ['10 pensil', '20 pensil', '24 pensil', '28 pensil'],
        correctIndex: 2,
        explanation:
          '4 kotak dikali 6 pensil = 6 + 6 + 6 + 6 = 24 pensil.',
      },
      {
        id: 'sd-math-2',
        prompt: 'Di sebuah jam dinding, jarum pendek menunjuk angka 9 dan jarum panjang menunjuk angka 12. Pukul berapakah itu?',
        image: IMG_MATEMATIKA,
        imageAlt: 'Ilustrasi jam dinding ceria',
        options: ['Pukul 12.00', 'Pukul 09.00', 'Pukul 09.30', 'Pukul 03.00'],
        correctIndex: 1,
        explanation:
          'Jarum pendek menunjukkan jam (9) dan jarum panjang di angka 12 menandakan tepat pukul 09.00.',
      },
      {
        id: 'sd-math-3',
        prompt: 'Berapakah hasil dari 125 + 45?',
        options: ['160', '170', '175', '180'],
        correctIndex: 1,
        explanation:
          'Satuan: 5 + 5 = 10 (tulis 0, simpan 1). Puluhan: 2 + 4 + 1 = 7. Ratusan: 1. Jadi hasilnya 170.',
      },
      {
        id: 'sd-math-4',
        prompt: 'Sebuah kue bolu dipotong menjadi 2 bagian yang sama besar. Satu potong kue bernilai pecahan?',
        options: ['1/4', '1/3', '1/2', '2/1'],
        correctIndex: 2,
        explanation:
          'Satu kue utuh yang dibagi menjadi 2 bagian sama besar masing-masing bernilai setengah atau 1/2.',
      },
      {
        id: 'sd-math-5',
        prompt: 'Bangun datar segitiga memiliki berapa banyak sisi?',
        options: ['2 sisi', '3 sisi', '4 sisi', '5 sisi'],
        correctIndex: 1,
        explanation:
          'Sesuai namanya, segi-tiga memiliki 3 sisi dan 3 titik sudut.',
      },
      {
        id: 'sd-math-6',
        prompt: 'Rani memiliki 15 permen dan ingin membagikannya sama rata kepada 3 temannya. Setiap teman mendapat berapa permen?',
        options: ['3 permen', '4 permen', '5 permen', '6 permen'],
        correctIndex: 2,
        explanation:
          '15 dibagi 3 sama dengan 5, karena 5 × 3 = 15.',
      },
      {
        id: 'sd-math-7',
        prompt: 'Lanjutkan pola bilangan loncat 5 berikut ini: 5, 10, 15, 20, ...',
        options: ['22', '24', '25', '30'],
        correctIndex: 2,
        explanation:
          'Setiap langkah bertambah 5. Setelah 20, maka 20 + 5 = 25.',
      },
      {
        id: 'sd-math-8',
        prompt: 'Budi membeli buku tulis seharga Rp3.000 dengan membayar uang Rp5.000. Berapa uang kembalian Budi?',
        options: ['Rp1.000', 'Rp2.000', 'Rp2.500', 'Rp3.000'],
        correctIndex: 1,
        explanation:
          'Rp5.000 dikurangi Rp3.000 sama dengan Rp2.000.',
      },
    ],
  },
  {
    id: 'sejarah-kelas-3',
    title: 'Cerita & Budaya Bangsa Indonesia',
    description:
      'Mengenal bendera Merah Putih, lagu kebangsaan, pahlawan nasional, kapal Pinisi, dan sikap rukun.',
    category: 'Sejarah',
    difficulty: 'Dasar',
    estimatedMinutes: 3,
    coverImage: IMG_SEJARAH,
    questions: [
      {
        id: 'sd-his-1',
        prompt: 'Apakah warna bendera negara Indonesia?',
        image: IMG_SEJARAH,
        imageAlt: 'Ilustrasi perahu Pinisi dengan bendera Merah Putih dan Candi Borobudur',
        options: ['Biru dan Putih', 'Merah dan Kuning', 'Merah dan Putih', 'Hijau dan Putih'],
        correctIndex: 2,
        explanation:
          'Bendera Indonesia berwarna Merah Putih (Sang Saka Merah Putih). Merah artinya berani dan putih artinya suci.',
      },
      {
        id: 'sd-his-2',
        prompt: 'Setiap tanggal berapakah kita merayakan Hari Kemerdekaan Indonesia?',
        options: ['1 Juni', '17 Agustus', '28 Oktober', '10 November'],
        correctIndex: 1,
        explanation:
          'Indonesia merdeka pada tanggal 17 Agustus 1945, sehingga setiap 17 Agustus kita merayakan ulang tahun kemerdekaan.',
      },
      {
        id: 'sd-his-3',
        prompt: 'Judul lagu kebangsaan Indonesia yang selalu kita nyanyikan saat upacara bendera di sekolah adalah?',
        options: ['Garuda Pancasila', 'Indonesia Raya', 'Halo-Halo Bandung', 'Satu Nusa Satu Bangsa'],
        correctIndex: 1,
        explanation:
          'Lagu kebangsaan kita adalah Indonesia Raya yang diciptakan oleh Wage Rudolf Supratman.',
      },
      {
        id: 'sd-his-4',
        prompt: 'Semboyan bangsa Indonesia yang tertulis pada pita burung Garuda Pancasila berbunyi?',
        options: ['Tut Wuri Handayani', 'Bhinneka Tunggal Ika', 'Bersatu Kita Teguh', 'Maju Terus Pantang Mundur'],
        correctIndex: 1,
        explanation:
          'Bhinneka Tunggal Ika artinya walaupun berbeda-beda suku, bahasa, dan budaya, kita tetap satu Indonesia.',
      },
      {
        id: 'sd-his-5',
        prompt: 'Candi Borobudur yang sangat megah dan terkenal di seluruh dunia terletak di provinsi mana?',
        image: IMG_SEJARAH,
        imageAlt: 'Ilustrasi siluet Candi Borobudur saat matahari terbit',
        options: ['Bali', 'Jawa Tengah', 'Sumatra Barat', 'Kalimantan Timur'],
        correctIndex: 1,
        explanation:
          'Candi Borobudur terletak di Kabupaten Magelang, Provinsi Jawa Tengah.',
      },
      {
        id: 'sd-his-6',
        prompt: 'Perahu layar kayu tradisional kebanggaan pelaut Bugis-Makassar dari Sulawesi Selatan bernama?',
        options: ['Perahu Kertas', 'Kapal Pinisi', 'Rakit Bambu', 'Kapal Selam'],
        correctIndex: 1,
        explanation:
          'Kapal Pinisi adalah perahu layar tradisional Indonesia yang terkenal tangguh mengarungi lautan luas.',
      },
      {
        id: 'sd-his-7',
        prompt: 'Siapakah ibu pahlawan dari Jepara yang berjuang agar anak perempuan Indonesia bisa bersekolah?',
        options: ['R.A. Kartini', 'Cut Nyak Dien', 'Fatmawati', 'Martha Christina Tiahahu'],
        correctIndex: 0,
        explanation:
          'R.A. Kartini memperjuangkan pendidikan bagi kaum perempuan. Hari Kartini diperingati setiap tanggal 21 April.',
      },
      {
        id: 'sd-his-8',
        prompt: 'Jika ada teman di kelas yang kesulitan membersihkan papan tulis, sikap terbaik kita adalah?',
        options: [
          'Membiarkannya bekerja sendirian',
          'Menertawakannya dari bangku',
          'Membantunya bersama-sama dengan senang hati',
          'Langsung pulang lebih dulu',
        ],
        correctIndex: 2,
        explanation:
          'Gotong royong dan saling membantu membuat pekerjaan cepat selesai dan pertemanan makin rukun.',
      },
    ],
  },
  {
    id: 'geografi-kelas-3',
    title: 'Alam, Cuaca & Kepulauan Indonesia',
    description:
      'Petualangan mengenal arah mata angin, pulau-pulau di Indonesia, cuaca, pelangi, dan menjaga kelestarian alam.',
    category: 'Geografi',
    difficulty: 'Dasar',
    estimatedMinutes: 3,
    coverImage: IMG_GEOGRAFI,
    questions: [
      {
        id: 'sd-geo-1',
        prompt: 'Setiap pagi hari, Matahari selalu terbit dari arah mata angin sebelah mana?',
        image: IMG_GEOGRAFI,
        imageAlt: 'Ilustrasi peta pulau tropis dan kompas arah mata angin',
        options: ['Barat', 'Timur', 'Utara', 'Selatan'],
        correctIndex: 1,
        explanation:
          'Matahari terbit di sebelah Timur pada pagi hari dan terbenam di sebelah Barat pada sore hari.',
      },
      {
        id: 'sd-geo-2',
        prompt: 'Indonesia adalah negara kepulauan. Di pulau manakah kota Jakarta dan Bandung berada?',
        options: ['Pulau Sumatra', 'Pulau Jawa', 'Pulau Kalimantan', 'Pulau Papua'],
        correctIndex: 1,
        explanation:
          'Jakarta dan Bandung terletak di Pulau Jawa, salah satu pulau dengan penduduk terbanyak di Indonesia.',
      },
      {
        id: 'sd-geo-3',
        prompt: 'Indonesia memiliki dua musim utama sepanjang tahun, yaitu musim kemarau dan musim?',
        options: ['Musim salju', 'Musim gugur', 'Musim hujan', 'Musim semi'],
        correctIndex: 2,
        explanation:
          'Karena terletak di dekat garis khatulistiwa, Indonesia beriklim tropis dengan dua musim: hujan dan kemarau.',
      },
      {
        id: 'sd-geo-4',
        prompt: 'Lengkungan warna-warni indah di langit yang sering muncul setelah hujan turun dan matahari bersinar disebut?',
        image: IMG_GEOGRAFI,
        imageAlt: 'Ilustrasi pelangi di atas hutan hijau dan gunung',
        options: ['Petir', 'Pelangi', 'Kabut', 'Topan'],
        correctIndex: 1,
        explanation:
          'Pelangi terjadi karena cahaya matahari dibiaskan oleh titik-titik air hujan di udara.',
      },
      {
        id: 'sd-geo-5',
        prompt: 'Alat petunjuk arah yang jarumnya selalu menunjuk ke arah Utara dan Selatan disebut?',
        options: ['Termometer', 'Kompas', 'Penggaris', 'Jam pasir'],
        correctIndex: 1,
        explanation:
          'Kompas membantu para petualang, pelaut, dan pendaki gunung agar tidak tersesat mencari arah.',
      },
      {
        id: 'sd-geo-6',
        prompt: 'Tempat aliran air tawar yang panjang dari pegunungan menuju ke laut disebut?',
        options: ['Sungai', 'Gurun', 'Bukit', 'Lembah'],
        correctIndex: 0,
        explanation:
          'Sungai mengalirkan air dari tempat tinggi (pegunungan) menuju ke tempat yang lebih rendah hingga ke laut.',
      },
      {
        id: 'sd-geo-7',
        prompt: 'Manakah kegiatan yang baik dilakukan untuk menjaga kebersihan sungai dan pantai?',
        options: [
          'Membuang bungkus plastik ke dalam selokan',
          'Membuang sampah pada tempatnya',
          'Menebang semua pohon di pinggir pantai',
          'Mencoret-coret batu karang',
        ],
        correctIndex: 1,
        explanation:
          'Membuang sampah pada tempatnya menjaga air tetap bersih sehingga ikan dan hewan laut tetap hidup sehat.',
      },
      {
        id: 'sd-geo-8',
        prompt: 'Pulau terbesar di Indonesia yang terkenal dengan hutan hujannya dan habitat orangutan adalah?',
        options: ['Pulau Bali', 'Pulau Madura', 'Pulau Kalimantan', 'Pulau Lombok'],
        correctIndex: 2,
        explanation:
          'Pulau Kalimantan memiliki hutan hujan tropis yang luas dan menjadi rumah bagi satwa langka seperti orangutan.',
      },
    ],
  },
];

export function createQuickMixQuiz(allQuizzes: QuizPack[], questionCount = 8): QuizPack {
  const pool = allQuizzes.flatMap((pack) => pack.questions);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  return {
    id: `quick-mix-${Date.now()}`,
    title: 'Kuis Campuran Seru',
    description: 'Gabungan soal acak dari Sains, Matematika, Budaya, dan Alam untuk Kelas 3 SD.',
    category: 'Sains',
    difficulty: 'Dasar',
    estimatedMinutes: Math.max(2, Math.ceil(selected.length * 0.5)),
    questions: selected,
  };
}
