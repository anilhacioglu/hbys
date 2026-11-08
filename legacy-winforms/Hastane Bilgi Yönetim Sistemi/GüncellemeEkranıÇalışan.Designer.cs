namespace Hastane_Bilgi_Yönetim_Sistemi
{
    partial class frm_CalisanGuncellemeEkranı
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.cmb_Unvan = new System.Windows.Forms.ComboBox();
            this.cmb_Bolum = new System.Windows.Forms.ComboBox();
            this.lbl_Aciklama = new System.Windows.Forms.Label();
            this.lbl_Ozgecmis = new System.Windows.Forms.Label();
            this.txt_Acıklama = new System.Windows.Forms.TextBox();
            this.txt_Ozgecmis = new System.Windows.Forms.TextBox();
            this.dt_HastaneyeGirisiTarihi = new System.Windows.Forms.DateTimePicker();
            this.lbl_HastaneyeGirisTarih = new System.Windows.Forms.Label();
            this.dt_DogumTarihi = new System.Windows.Forms.DateTimePicker();
            this.cmb_DogumYeri = new System.Windows.Forms.ComboBox();
            this.cmb_KanGrubu = new System.Windows.Forms.ComboBox();
            this.cmb_GuvenlikKurumu = new System.Windows.Forms.ComboBox();
            this.cmb_Cinsiyet = new System.Windows.Forms.ComboBox();
            this.lbl_Cinsiyet = new System.Windows.Forms.Label();
            this.lbl_DogumTarihi = new System.Windows.Forms.Label();
            this.lbl_DogumYeri = new System.Windows.Forms.Label();
            this.lbl_Unvan = new System.Windows.Forms.Label();
            this.lbl_Bolum = new System.Windows.Forms.Label();
            this.lbl_Ad = new System.Windows.Forms.Label();
            this.lbl_KanGrubu = new System.Windows.Forms.Label();
            this.lbl_Soyad = new System.Windows.Forms.Label();
            this.lbl_GüvenlikKurumu = new System.Windows.Forms.Label();
            this.lbl_MailAdres = new System.Windows.Forms.Label();
            this.lbl_İletisimNo = new System.Windows.Forms.Label();
            this.lbl_TcKimlik = new System.Windows.Forms.Label();
            this.txt_Ad = new System.Windows.Forms.TextBox();
            this.txt_Soyad = new System.Windows.Forms.TextBox();
            this.txt_MailAdres = new System.Windows.Forms.TextBox();
            this.txt_İletisimNo = new System.Windows.Forms.TextBox();
            this.txt_TcKimlikNo = new System.Windows.Forms.TextBox();
            this.btn_Guncelle = new System.Windows.Forms.Button();
            this.btn_İptal = new System.Windows.Forms.Button();
            this.lbl_Baslik = new System.Windows.Forms.Label();
            this.pic_İkinciSerit = new System.Windows.Forms.PictureBox();
            this.pic_UstTaraf = new System.Windows.Forms.PictureBox();
            this.pic_UcuncuSerit = new System.Windows.Forms.PictureBox();
            this.pic_DorduncuSerit = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.pic_İkinciSerit)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UcuncuSerit)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_DorduncuSerit)).BeginInit();
            this.SuspendLayout();
            // 
            // cmb_Unvan
            // 
            this.cmb_Unvan.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_Unvan.FormattingEnabled = true;
            this.cmb_Unvan.Items.AddRange(new object[] {
            "Stajyer Doktor",
            "İntern Doktor",
            "Pratisyen Doktor",
            "Uzman Doktor",
            "Operatör Doktor",
            "Yardımcı Doçent",
            "Doçent",
            "Profesör",
            "Ordinaryüs"});
            this.cmb_Unvan.Location = new System.Drawing.Point(611, 575);
            this.cmb_Unvan.Name = "cmb_Unvan";
            this.cmb_Unvan.Size = new System.Drawing.Size(193, 30);
            this.cmb_Unvan.TabIndex = 87;
            // 
            // cmb_Bolum
            // 
            this.cmb_Bolum.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_Bolum.FormattingEnabled = true;
            this.cmb_Bolum.Items.AddRange(new object[] {
            "Acil Tıp",
            "Adli Tıp",
            "Anatomi",
            "Anestezi Ve Reanimasyon",
            "Beyin Ve Sinir Cerrahisi",
            "Biyofizik",
            "Çocuk Cerrahisi",
            "Çocuk Ruh Sağlığı",
            "Çocuk Sağlığı ve Hastalıkları",
            "Dermatoloji",
            "Enfeksiyon Hastalıkları",
            "Fiziksel Tıp ve Rehabilitasyon",
            "Genel Cerrahi",
            "Göğüs Hastalıkları",
            "Göz Hastalıkları",
            "Halk Sağlığı",
            "İç Hastalıklar",
            "Kardiyoloji",
            "Kalp ve Damar Cerrahisi",
            "Kadın Hastalıkları ve Doğum",
            "Kulak Burun Boğaz",
            "Nöroloji",
            "Nükleer Tıp",
            "Ortopedi ve Travmatoloji",
            "Radyasyon Onkolojisi",
            "Radyoloji",
            "Psikiyatri",
            "Tıbbi Farmakoloji",
            "Tıbbi Genetik",
            "Tıbbi Patoloji",
            "Tıbbi Mikrobiyoloji",
            "Tıp Bilişimi",
            "Tıbbi Biyokimya",
            "Üroloji",
            "Plastik Rekonstrüktif ve Estetik Cerrahi"});
            this.cmb_Bolum.Location = new System.Drawing.Point(321, 575);
            this.cmb_Bolum.Name = "cmb_Bolum";
            this.cmb_Bolum.Size = new System.Drawing.Size(191, 30);
            this.cmb_Bolum.TabIndex = 86;
            // 
            // lbl_Aciklama
            // 
            this.lbl_Aciklama.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_Aciklama.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_Aciklama.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Aciklama.ForeColor = System.Drawing.Color.White;
            this.lbl_Aciklama.Location = new System.Drawing.Point(201, 486);
            this.lbl_Aciklama.Name = "lbl_Aciklama";
            this.lbl_Aciklama.Size = new System.Drawing.Size(113, 64);
            this.lbl_Aciklama.TabIndex = 84;
            this.lbl_Aciklama.Text = "Açıklama";
            this.lbl_Aciklama.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_Ozgecmis
            // 
            this.lbl_Ozgecmis.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_Ozgecmis.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_Ozgecmis.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Ozgecmis.ForeColor = System.Drawing.Color.White;
            this.lbl_Ozgecmis.Location = new System.Drawing.Point(201, 394);
            this.lbl_Ozgecmis.Name = "lbl_Ozgecmis";
            this.lbl_Ozgecmis.Size = new System.Drawing.Size(113, 64);
            this.lbl_Ozgecmis.TabIndex = 85;
            this.lbl_Ozgecmis.Text = "Öz Geçmiş";
            this.lbl_Ozgecmis.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // txt_Acıklama
            // 
            this.txt_Acıklama.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_Acıklama.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_Acıklama.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_Acıklama.ForeColor = System.Drawing.Color.Black;
            this.txt_Acıklama.Location = new System.Drawing.Point(320, 486);
            this.txt_Acıklama.MaxLength = 200;
            this.txt_Acıklama.Multiline = true;
            this.txt_Acıklama.Name = "txt_Acıklama";
            this.txt_Acıklama.Size = new System.Drawing.Size(484, 64);
            this.txt_Acıklama.TabIndex = 82;
            // 
            // txt_Ozgecmis
            // 
            this.txt_Ozgecmis.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_Ozgecmis.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_Ozgecmis.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_Ozgecmis.ForeColor = System.Drawing.Color.Black;
            this.txt_Ozgecmis.Location = new System.Drawing.Point(320, 394);
            this.txt_Ozgecmis.MaxLength = 200;
            this.txt_Ozgecmis.Multiline = true;
            this.txt_Ozgecmis.Name = "txt_Ozgecmis";
            this.txt_Ozgecmis.Size = new System.Drawing.Size(484, 64);
            this.txt_Ozgecmis.TabIndex = 83;
            // 
            // dt_HastaneyeGirisiTarihi
            // 
            this.dt_HastaneyeGirisiTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.dt_HastaneyeGirisiTarihi.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dt_HastaneyeGirisiTarihi.Location = new System.Drawing.Point(556, 637);
            this.dt_HastaneyeGirisiTarihi.Name = "dt_HastaneyeGirisiTarihi";
            this.dt_HastaneyeGirisiTarihi.Size = new System.Drawing.Size(142, 30);
            this.dt_HastaneyeGirisiTarihi.TabIndex = 81;
            // 
            // lbl_HastaneyeGirisTarih
            // 
            this.lbl_HastaneyeGirisTarih.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_HastaneyeGirisTarih.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_HastaneyeGirisTarih.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_HastaneyeGirisTarih.ForeColor = System.Drawing.Color.White;
            this.lbl_HastaneyeGirisTarih.Location = new System.Drawing.Point(303, 629);
            this.lbl_HastaneyeGirisTarih.Name = "lbl_HastaneyeGirisTarih";
            this.lbl_HastaneyeGirisTarih.Size = new System.Drawing.Size(248, 47);
            this.lbl_HastaneyeGirisTarih.TabIndex = 80;
            this.lbl_HastaneyeGirisTarih.Text = "Hastaneye Giriş Tarihi";
            this.lbl_HastaneyeGirisTarih.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // dt_DogumTarihi
            // 
            this.dt_DogumTarihi.CustomFormat = "dd/mm/year";
            this.dt_DogumTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.dt_DogumTarihi.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dt_DogumTarihi.Location = new System.Drawing.Point(829, 148);
            this.dt_DogumTarihi.Name = "dt_DogumTarihi";
            this.dt_DogumTarihi.Size = new System.Drawing.Size(180, 30);
            this.dt_DogumTarihi.TabIndex = 77;
            // 
            // cmb_DogumYeri
            // 
            this.cmb_DogumYeri.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_DogumYeri.FormattingEnabled = true;
            this.cmb_DogumYeri.Items.AddRange(new object[] {
            "Adana",
            "Adıyaman",
            "Afyonkarahisar",
            "Ağrı",
            "Aksaray",
            "Amasya",
            "Ankara",
            "Antalya",
            "Ardahan",
            "Artvin",
            "Aydın",
            "Balıkesir",
            "Bartın",
            "Batman",
            "Bayburt",
            "Bilecik",
            "Bingöl",
            "Bitlis",
            "Bolu",
            "Burdur",
            "Bursa",
            "Çanakkale",
            "Çankırı",
            "Çorum",
            "Denizli",
            "Diyarbakır",
            "Düzce",
            "Edirne",
            "Elazığ",
            "Erzincan",
            "Erzurum",
            "Eskişehir",
            "Gaziantep",
            "Giresun",
            "Gümüşhane",
            "Hakkâri",
            "Hatay",
            "Iğdır",
            "Isparta",
            "İstanbul",
            "İzmir",
            "Kahramanmaraş",
            "Karabük",
            "Karaman",
            "Kars",
            "Kastamonu",
            "Kayseri",
            "Kilis",
            "Kırıkkale",
            "Kırklareli",
            "Kırşehir",
            "Kocaeli",
            "Konya",
            "Kütahya",
            "Malatya",
            "Manisa",
            "Mardin",
            "Mersin",
            "Muğla",
            "Muş",
            "Nevşehir",
            "Niğde",
            "Ordu",
            "Osmaniye",
            "Rize",
            "Sakarya",
            "Samsun",
            "Şanlıurfa",
            "Siirt",
            "Sinop",
            "Sivas",
            "Şırnak",
            "Tekirdağ",
            "Tokat",
            "Trabzon",
            "Tunceli",
            "Uşak",
            "Van",
            "Yalova",
            "Yozgat",
            "Zonguldak"});
            this.cmb_DogumYeri.Location = new System.Drawing.Point(829, 95);
            this.cmb_DogumYeri.Name = "cmb_DogumYeri";
            this.cmb_DogumYeri.Size = new System.Drawing.Size(180, 30);
            this.cmb_DogumYeri.TabIndex = 76;
            // 
            // cmb_KanGrubu
            // 
            this.cmb_KanGrubu.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_KanGrubu.FormattingEnabled = true;
            this.cmb_KanGrubu.Items.AddRange(new object[] {
            "A Rh -",
            "A Rh + ",
            "B Rh -",
            "B Rh + ",
            "AB Rh -",
            "AB Rh + ",
            "0 Rh -",
            "0 Rh + "});
            this.cmb_KanGrubu.Location = new System.Drawing.Point(196, 202);
            this.cmb_KanGrubu.Name = "cmb_KanGrubu";
            this.cmb_KanGrubu.Size = new System.Drawing.Size(180, 30);
            this.cmb_KanGrubu.TabIndex = 75;
            // 
            // cmb_GuvenlikKurumu
            // 
            this.cmb_GuvenlikKurumu.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_GuvenlikKurumu.FormattingEnabled = true;
            this.cmb_GuvenlikKurumu.Items.AddRange(new object[] {
            "SSK",
            "SGK",
            "BAĞ-KUR",
            "EMEKLİ SANDIĞI"});
            this.cmb_GuvenlikKurumu.Location = new System.Drawing.Point(196, 152);
            this.cmb_GuvenlikKurumu.Name = "cmb_GuvenlikKurumu";
            this.cmb_GuvenlikKurumu.Size = new System.Drawing.Size(180, 30);
            this.cmb_GuvenlikKurumu.TabIndex = 74;
            // 
            // cmb_Cinsiyet
            // 
            this.cmb_Cinsiyet.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_Cinsiyet.FormattingEnabled = true;
            this.cmb_Cinsiyet.Items.AddRange(new object[] {
            "Erkek",
            "Kadın"});
            this.cmb_Cinsiyet.Location = new System.Drawing.Point(829, 205);
            this.cmb_Cinsiyet.Name = "cmb_Cinsiyet";
            this.cmb_Cinsiyet.Size = new System.Drawing.Size(180, 30);
            this.cmb_Cinsiyet.TabIndex = 73;
            // 
            // lbl_Cinsiyet
            // 
            this.lbl_Cinsiyet.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_Cinsiyet.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Cinsiyet.ForeColor = System.Drawing.Color.White;
            this.lbl_Cinsiyet.Location = new System.Drawing.Point(674, 209);
            this.lbl_Cinsiyet.Name = "lbl_Cinsiyet";
            this.lbl_Cinsiyet.Size = new System.Drawing.Size(149, 22);
            this.lbl_Cinsiyet.TabIndex = 71;
            this.lbl_Cinsiyet.Text = "Cinsiyet";
            this.lbl_Cinsiyet.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_DogumTarihi
            // 
            this.lbl_DogumTarihi.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_DogumTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_DogumTarihi.ForeColor = System.Drawing.Color.White;
            this.lbl_DogumTarihi.Location = new System.Drawing.Point(677, 152);
            this.lbl_DogumTarihi.Name = "lbl_DogumTarihi";
            this.lbl_DogumTarihi.Size = new System.Drawing.Size(149, 22);
            this.lbl_DogumTarihi.TabIndex = 70;
            this.lbl_DogumTarihi.Text = "Doğum Tarihi";
            this.lbl_DogumTarihi.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_DogumYeri
            // 
            this.lbl_DogumYeri.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_DogumYeri.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_DogumYeri.ForeColor = System.Drawing.Color.White;
            this.lbl_DogumYeri.Location = new System.Drawing.Point(679, 99);
            this.lbl_DogumYeri.Name = "lbl_DogumYeri";
            this.lbl_DogumYeri.Size = new System.Drawing.Size(144, 22);
            this.lbl_DogumYeri.TabIndex = 72;
            this.lbl_DogumYeri.Text = "Doğum Yeri";
            this.lbl_DogumYeri.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_Unvan
            // 
            this.lbl_Unvan.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_Unvan.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Unvan.ForeColor = System.Drawing.Color.White;
            this.lbl_Unvan.Location = new System.Drawing.Point(518, 579);
            this.lbl_Unvan.Name = "lbl_Unvan";
            this.lbl_Unvan.Size = new System.Drawing.Size(87, 22);
            this.lbl_Unvan.TabIndex = 69;
            this.lbl_Unvan.Text = "Ünvan";
            this.lbl_Unvan.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_Bolum
            // 
            this.lbl_Bolum.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_Bolum.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Bolum.ForeColor = System.Drawing.Color.White;
            this.lbl_Bolum.Location = new System.Drawing.Point(201, 580);
            this.lbl_Bolum.Name = "lbl_Bolum";
            this.lbl_Bolum.Size = new System.Drawing.Size(113, 22);
            this.lbl_Bolum.TabIndex = 67;
            this.lbl_Bolum.Text = "Bölüm";
            this.lbl_Bolum.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_Ad
            // 
            this.lbl_Ad.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_Ad.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Ad.ForeColor = System.Drawing.Color.White;
            this.lbl_Ad.Location = new System.Drawing.Point(395, 126);
            this.lbl_Ad.Name = "lbl_Ad";
            this.lbl_Ad.Size = new System.Drawing.Size(87, 22);
            this.lbl_Ad.TabIndex = 68;
            this.lbl_Ad.Text = "Ad";
            this.lbl_Ad.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_KanGrubu
            // 
            this.lbl_KanGrubu.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_KanGrubu.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_KanGrubu.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_KanGrubu.ForeColor = System.Drawing.Color.White;
            this.lbl_KanGrubu.Location = new System.Drawing.Point(9, 205);
            this.lbl_KanGrubu.Name = "lbl_KanGrubu";
            this.lbl_KanGrubu.Size = new System.Drawing.Size(176, 22);
            this.lbl_KanGrubu.TabIndex = 66;
            this.lbl_KanGrubu.Text = "Kan Grubu";
            this.lbl_KanGrubu.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_Soyad
            // 
            this.lbl_Soyad.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_Soyad.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_Soyad.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Soyad.ForeColor = System.Drawing.Color.White;
            this.lbl_Soyad.Location = new System.Drawing.Point(398, 181);
            this.lbl_Soyad.Name = "lbl_Soyad";
            this.lbl_Soyad.Size = new System.Drawing.Size(78, 22);
            this.lbl_Soyad.TabIndex = 65;
            this.lbl_Soyad.Text = "Soyad";
            this.lbl_Soyad.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_GüvenlikKurumu
            // 
            this.lbl_GüvenlikKurumu.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_GüvenlikKurumu.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_GüvenlikKurumu.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_GüvenlikKurumu.ForeColor = System.Drawing.Color.White;
            this.lbl_GüvenlikKurumu.Location = new System.Drawing.Point(9, 156);
            this.lbl_GüvenlikKurumu.Name = "lbl_GüvenlikKurumu";
            this.lbl_GüvenlikKurumu.Size = new System.Drawing.Size(176, 22);
            this.lbl_GüvenlikKurumu.TabIndex = 64;
            this.lbl_GüvenlikKurumu.Text = "Güvenlik Kurumu";
            this.lbl_GüvenlikKurumu.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_MailAdres
            // 
            this.lbl_MailAdres.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_MailAdres.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_MailAdres.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_MailAdres.ForeColor = System.Drawing.Color.White;
            this.lbl_MailAdres.Location = new System.Drawing.Point(566, 303);
            this.lbl_MailAdres.Name = "lbl_MailAdres";
            this.lbl_MailAdres.Size = new System.Drawing.Size(107, 22);
            this.lbl_MailAdres.TabIndex = 63;
            this.lbl_MailAdres.Text = "Mail Adresi";
            this.lbl_MailAdres.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_İletisimNo
            // 
            this.lbl_İletisimNo.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_İletisimNo.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_İletisimNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_İletisimNo.ForeColor = System.Drawing.Color.White;
            this.lbl_İletisimNo.Location = new System.Drawing.Point(84, 303);
            this.lbl_İletisimNo.Name = "lbl_İletisimNo";
            this.lbl_İletisimNo.Size = new System.Drawing.Size(176, 22);
            this.lbl_İletisimNo.TabIndex = 62;
            this.lbl_İletisimNo.Text = "İletişim Numarası";
            this.lbl_İletisimNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_TcKimlik
            // 
            this.lbl_TcKimlik.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_TcKimlik.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_TcKimlik.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_TcKimlik.ForeColor = System.Drawing.Color.White;
            this.lbl_TcKimlik.Location = new System.Drawing.Point(12, 103);
            this.lbl_TcKimlik.Name = "lbl_TcKimlik";
            this.lbl_TcKimlik.Size = new System.Drawing.Size(176, 22);
            this.lbl_TcKimlik.TabIndex = 61;
            this.lbl_TcKimlik.Text = "TC Kimlik Numarası";
            this.lbl_TcKimlik.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // txt_Ad
            // 
            this.txt_Ad.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_Ad.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_Ad.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_Ad.ForeColor = System.Drawing.Color.Black;
            this.txt_Ad.Location = new System.Drawing.Point(486, 122);
            this.txt_Ad.MaxLength = 20;
            this.txt_Ad.Name = "txt_Ad";
            this.txt_Ad.Size = new System.Drawing.Size(180, 30);
            this.txt_Ad.TabIndex = 59;
            // 
            // txt_Soyad
            // 
            this.txt_Soyad.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_Soyad.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_Soyad.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_Soyad.ForeColor = System.Drawing.Color.Black;
            this.txt_Soyad.Location = new System.Drawing.Point(486, 179);
            this.txt_Soyad.MaxLength = 20;
            this.txt_Soyad.Name = "txt_Soyad";
            this.txt_Soyad.Size = new System.Drawing.Size(180, 30);
            this.txt_Soyad.TabIndex = 60;
            // 
            // txt_MailAdres
            // 
            this.txt_MailAdres.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_MailAdres.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_MailAdres.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_MailAdres.ForeColor = System.Drawing.Color.Black;
            this.txt_MailAdres.Location = new System.Drawing.Point(678, 299);
            this.txt_MailAdres.MaxLength = 40;
            this.txt_MailAdres.Name = "txt_MailAdres";
            this.txt_MailAdres.Size = new System.Drawing.Size(180, 30);
            this.txt_MailAdres.TabIndex = 56;
            // 
            // txt_İletisimNo
            // 
            this.txt_İletisimNo.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_İletisimNo.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_İletisimNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_İletisimNo.ForeColor = System.Drawing.Color.Black;
            this.txt_İletisimNo.Location = new System.Drawing.Point(267, 299);
            this.txt_İletisimNo.MaxLength = 11;
            this.txt_İletisimNo.Name = "txt_İletisimNo";
            this.txt_İletisimNo.Size = new System.Drawing.Size(180, 30);
            this.txt_İletisimNo.TabIndex = 58;
            // 
            // txt_TcKimlikNo
            // 
            this.txt_TcKimlikNo.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_TcKimlikNo.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_TcKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_TcKimlikNo.ForeColor = System.Drawing.Color.Black;
            this.txt_TcKimlikNo.Location = new System.Drawing.Point(196, 99);
            this.txt_TcKimlikNo.MaxLength = 11;
            this.txt_TcKimlikNo.Name = "txt_TcKimlikNo";
            this.txt_TcKimlikNo.Size = new System.Drawing.Size(180, 30);
            this.txt_TcKimlikNo.TabIndex = 57;
            // 
            // btn_Guncelle
            // 
            this.btn_Guncelle.BackColor = System.Drawing.Color.White;
            this.btn_Guncelle.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btn_Guncelle.FlatAppearance.BorderColor = System.Drawing.Color.Silver;
            this.btn_Guncelle.FlatAppearance.BorderSize = 0;
            this.btn_Guncelle.FlatAppearance.MouseDownBackColor = System.Drawing.Color.LawnGreen;
            this.btn_Guncelle.FlatAppearance.MouseOverBackColor = System.Drawing.Color.LawnGreen;
            this.btn_Guncelle.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_Guncelle.Font = new System.Drawing.Font("Century Gothic", 10F);
            this.btn_Guncelle.ForeColor = System.Drawing.Color.Black;
            this.btn_Guncelle.Location = new System.Drawing.Point(526, 717);
            this.btn_Guncelle.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Guncelle.Name = "btn_Guncelle";
            this.btn_Guncelle.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_Guncelle.Size = new System.Drawing.Size(85, 33);
            this.btn_Guncelle.TabIndex = 53;
            this.btn_Guncelle.Text = "Güncelle";
            this.btn_Guncelle.UseVisualStyleBackColor = false;
            this.btn_Guncelle.Click += new System.EventHandler(this.btn_Guncelle_Click);
            // 
            // btn_İptal
            // 
            this.btn_İptal.BackColor = System.Drawing.Color.White;
            this.btn_İptal.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btn_İptal.FlatAppearance.BorderColor = System.Drawing.Color.Silver;
            this.btn_İptal.FlatAppearance.BorderSize = 0;
            this.btn_İptal.FlatAppearance.MouseDownBackColor = System.Drawing.Color.IndianRed;
            this.btn_İptal.FlatAppearance.MouseOverBackColor = System.Drawing.Color.IndianRed;
            this.btn_İptal.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_İptal.Font = new System.Drawing.Font("Century Gothic", 10F);
            this.btn_İptal.ForeColor = System.Drawing.Color.Black;
            this.btn_İptal.Location = new System.Drawing.Point(413, 717);
            this.btn_İptal.Margin = new System.Windows.Forms.Padding(0);
            this.btn_İptal.Name = "btn_İptal";
            this.btn_İptal.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_İptal.Size = new System.Drawing.Size(85, 33);
            this.btn_İptal.TabIndex = 54;
            this.btn_İptal.Text = "İptal";
            this.btn_İptal.UseVisualStyleBackColor = false;
            this.btn_İptal.Click += new System.EventHandler(this.btn_İptal_Click);
            // 
            // lbl_Baslik
            // 
            this.lbl_Baslik.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_Baslik.AutoSize = true;
            this.lbl_Baslik.BackColor = System.Drawing.Color.DimGray;
            this.lbl_Baslik.Font = new System.Drawing.Font("Century Gothic", 16F);
            this.lbl_Baslik.ForeColor = System.Drawing.Color.White;
            this.lbl_Baslik.Location = new System.Drawing.Point(383, 24);
            this.lbl_Baslik.Name = "lbl_Baslik";
            this.lbl_Baslik.Size = new System.Drawing.Size(296, 25);
            this.lbl_Baslik.TabIndex = 52;
            this.lbl_Baslik.Text = "Çalışan Kayıt Güncelleme";
            this.lbl_Baslik.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // pic_İkinciSerit
            // 
            this.pic_İkinciSerit.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.pic_İkinciSerit.Location = new System.Drawing.Point(0, 84);
            this.pic_İkinciSerit.Name = "pic_İkinciSerit";
            this.pic_İkinciSerit.Size = new System.Drawing.Size(1024, 172);
            this.pic_İkinciSerit.TabIndex = 55;
            this.pic_İkinciSerit.TabStop = false;
            // 
            // pic_UstTaraf
            // 
            this.pic_UstTaraf.BackColor = System.Drawing.Color.DimGray;
            this.pic_UstTaraf.Location = new System.Drawing.Point(0, 12);
            this.pic_UstTaraf.Name = "pic_UstTaraf";
            this.pic_UstTaraf.Size = new System.Drawing.Size(1024, 50);
            this.pic_UstTaraf.TabIndex = 51;
            this.pic_UstTaraf.TabStop = false;
            // 
            // pic_UcuncuSerit
            // 
            this.pic_UcuncuSerit.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.pic_UcuncuSerit.Location = new System.Drawing.Point(0, 291);
            this.pic_UcuncuSerit.Name = "pic_UcuncuSerit";
            this.pic_UcuncuSerit.Size = new System.Drawing.Size(1024, 45);
            this.pic_UcuncuSerit.TabIndex = 78;
            this.pic_UcuncuSerit.TabStop = false;
            // 
            // pic_DorduncuSerit
            // 
            this.pic_DorduncuSerit.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.pic_DorduncuSerit.Location = new System.Drawing.Point(186, 371);
            this.pic_DorduncuSerit.Name = "pic_DorduncuSerit";
            this.pic_DorduncuSerit.Size = new System.Drawing.Size(643, 325);
            this.pic_DorduncuSerit.TabIndex = 79;
            this.pic_DorduncuSerit.TabStop = false;
            // 
            // frm_CalisanGuncellemeEkranı
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1024, 768);
            this.ControlBox = false;
            this.Controls.Add(this.cmb_Unvan);
            this.Controls.Add(this.cmb_Bolum);
            this.Controls.Add(this.lbl_Aciklama);
            this.Controls.Add(this.lbl_Ozgecmis);
            this.Controls.Add(this.txt_Acıklama);
            this.Controls.Add(this.txt_Ozgecmis);
            this.Controls.Add(this.dt_HastaneyeGirisiTarihi);
            this.Controls.Add(this.lbl_HastaneyeGirisTarih);
            this.Controls.Add(this.dt_DogumTarihi);
            this.Controls.Add(this.cmb_DogumYeri);
            this.Controls.Add(this.cmb_KanGrubu);
            this.Controls.Add(this.cmb_GuvenlikKurumu);
            this.Controls.Add(this.cmb_Cinsiyet);
            this.Controls.Add(this.lbl_Cinsiyet);
            this.Controls.Add(this.lbl_DogumTarihi);
            this.Controls.Add(this.lbl_DogumYeri);
            this.Controls.Add(this.lbl_Unvan);
            this.Controls.Add(this.lbl_Bolum);
            this.Controls.Add(this.lbl_Ad);
            this.Controls.Add(this.lbl_KanGrubu);
            this.Controls.Add(this.lbl_Soyad);
            this.Controls.Add(this.lbl_GüvenlikKurumu);
            this.Controls.Add(this.lbl_MailAdres);
            this.Controls.Add(this.lbl_İletisimNo);
            this.Controls.Add(this.lbl_TcKimlik);
            this.Controls.Add(this.txt_Ad);
            this.Controls.Add(this.txt_Soyad);
            this.Controls.Add(this.txt_MailAdres);
            this.Controls.Add(this.txt_İletisimNo);
            this.Controls.Add(this.txt_TcKimlikNo);
            this.Controls.Add(this.pic_İkinciSerit);
            this.Controls.Add(this.btn_Guncelle);
            this.Controls.Add(this.btn_İptal);
            this.Controls.Add(this.lbl_Baslik);
            this.Controls.Add(this.pic_UstTaraf);
            this.Controls.Add(this.pic_UcuncuSerit);
            this.Controls.Add(this.pic_DorduncuSerit);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frm_CalisanGuncellemeEkranı";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "GüncellemeEkranıÇalışan";
            this.Load += new System.EventHandler(this.frm_CalisanGuncellemeEkranı_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pic_İkinciSerit)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UcuncuSerit)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_DorduncuSerit)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ComboBox cmb_Unvan;
        private System.Windows.Forms.ComboBox cmb_Bolum;
        private System.Windows.Forms.Label lbl_Aciklama;
        private System.Windows.Forms.Label lbl_Ozgecmis;
        private System.Windows.Forms.TextBox txt_Acıklama;
        private System.Windows.Forms.TextBox txt_Ozgecmis;
        private System.Windows.Forms.DateTimePicker dt_HastaneyeGirisiTarihi;
        private System.Windows.Forms.Label lbl_HastaneyeGirisTarih;
        private System.Windows.Forms.DateTimePicker dt_DogumTarihi;
        private System.Windows.Forms.ComboBox cmb_DogumYeri;
        private System.Windows.Forms.ComboBox cmb_KanGrubu;
        private System.Windows.Forms.ComboBox cmb_GuvenlikKurumu;
        private System.Windows.Forms.ComboBox cmb_Cinsiyet;
        private System.Windows.Forms.Label lbl_Cinsiyet;
        private System.Windows.Forms.Label lbl_DogumTarihi;
        private System.Windows.Forms.Label lbl_DogumYeri;
        private System.Windows.Forms.Label lbl_Unvan;
        private System.Windows.Forms.Label lbl_Bolum;
        private System.Windows.Forms.Label lbl_Ad;
        private System.Windows.Forms.Label lbl_KanGrubu;
        private System.Windows.Forms.Label lbl_Soyad;
        private System.Windows.Forms.Label lbl_GüvenlikKurumu;
        private System.Windows.Forms.Label lbl_MailAdres;
        private System.Windows.Forms.Label lbl_İletisimNo;
        private System.Windows.Forms.Label lbl_TcKimlik;
        private System.Windows.Forms.TextBox txt_Ad;
        private System.Windows.Forms.TextBox txt_Soyad;
        private System.Windows.Forms.TextBox txt_MailAdres;
        private System.Windows.Forms.TextBox txt_İletisimNo;
        private System.Windows.Forms.TextBox txt_TcKimlikNo;
        private System.Windows.Forms.PictureBox pic_İkinciSerit;
        private System.Windows.Forms.Button btn_Guncelle;
        private System.Windows.Forms.Button btn_İptal;
        private System.Windows.Forms.Label lbl_Baslik;
        private System.Windows.Forms.PictureBox pic_UstTaraf;
        private System.Windows.Forms.PictureBox pic_UcuncuSerit;
        private System.Windows.Forms.PictureBox pic_DorduncuSerit;
    }
}