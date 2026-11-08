namespace Hastane_Bilgi_Yönetim_Sistemi
{
    partial class frm_YeniReçeteEkranı
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
            this.components = new System.ComponentModel.Container();
            this.btn_Kaydet = new System.Windows.Forms.Button();
            this.btn_İptal = new System.Windows.Forms.Button();
            this.lbl_Baslik = new System.Windows.Forms.Label();
            this.pic_UstTaraf = new System.Windows.Forms.PictureBox();
            this.cmb_HastaTcKimlikNo = new System.Windows.Forms.ComboBox();
            this.patientlistBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.veritabanıHasta = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıHasta();
            this.lbl_TcKimlikNo = new System.Windows.Forms.Label();
            this.picİkinciSerit = new System.Windows.Forms.PictureBox();
            this.pic_AltTaraf = new System.Windows.Forms.PictureBox();
            this.lbl_İlacAd = new System.Windows.Forms.Label();
            this.lbl_İlacKullanımSekli = new System.Windows.Forms.Label();
            this.lbl_KullanımPeriyodu = new System.Windows.Forms.Label();
            this.lbl_PerBirimi = new System.Windows.Forms.Label();
            this.lbl_KutuAdet = new System.Windows.Forms.Label();
            this.lbl_PerAdet = new System.Windows.Forms.Label();
            this.lbl_PerDoz = new System.Windows.Forms.Label();
            this.txt_KullanımPeriyodu = new System.Windows.Forms.TextBox();
            this.txt_KutuAdeti = new System.Windows.Forms.TextBox();
            this.txt_PerAdet = new System.Windows.Forms.TextBox();
            this.txt_PerDoz = new System.Windows.Forms.TextBox();
            this.txt_İlacAd = new System.Windows.Forms.TextBox();
            this.txt_KullanımSekli = new System.Windows.Forms.TextBox();
            this.txt_PerBirimi = new System.Windows.Forms.TextBox();
            this.list_İlacKullanımSekli = new System.Windows.Forms.ListBox();
            this.list_İlacAd = new System.Windows.Forms.ListBox();
            this.list_KullanımPeriyodu = new System.Windows.Forms.ListBox();
            this.list_KutuAdet = new System.Windows.Forms.ListBox();
            this.list_PerAdet = new System.Windows.Forms.ListBox();
            this.list_PerDoz = new System.Windows.Forms.ListBox();
            this.list_PerBirimi = new System.Windows.Forms.ListBox();
            this.patientlistTableAdapter = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıHastaTableAdapters.patientlistTableAdapter();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.patientlistBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıHasta)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picİkinciSerit)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_AltTaraf)).BeginInit();
            this.SuspendLayout();
            // 
            // btn_Kaydet
            // 
            this.btn_Kaydet.BackColor = System.Drawing.Color.White;
            this.btn_Kaydet.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btn_Kaydet.FlatAppearance.BorderColor = System.Drawing.Color.Silver;
            this.btn_Kaydet.FlatAppearance.BorderSize = 0;
            this.btn_Kaydet.FlatAppearance.MouseDownBackColor = System.Drawing.Color.LawnGreen;
            this.btn_Kaydet.FlatAppearance.MouseOverBackColor = System.Drawing.Color.LawnGreen;
            this.btn_Kaydet.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_Kaydet.Font = new System.Drawing.Font("Century Gothic", 10F);
            this.btn_Kaydet.ForeColor = System.Drawing.Color.Black;
            this.btn_Kaydet.Location = new System.Drawing.Point(537, 715);
            this.btn_Kaydet.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Kaydet.Name = "btn_Kaydet";
            this.btn_Kaydet.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_Kaydet.Size = new System.Drawing.Size(85, 33);
            this.btn_Kaydet.TabIndex = 34;
            this.btn_Kaydet.Text = "Kaydet";
            this.btn_Kaydet.UseVisualStyleBackColor = false;
            this.btn_Kaydet.Click += new System.EventHandler(this.btn_Kaydet_Click);
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
            this.btn_İptal.Location = new System.Drawing.Point(428, 715);
            this.btn_İptal.Margin = new System.Windows.Forms.Padding(0);
            this.btn_İptal.Name = "btn_İptal";
            this.btn_İptal.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_İptal.Size = new System.Drawing.Size(85, 33);
            this.btn_İptal.TabIndex = 35;
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
            this.lbl_Baslik.Location = new System.Drawing.Point(462, 24);
            this.lbl_Baslik.Name = "lbl_Baslik";
            this.lbl_Baslik.Size = new System.Drawing.Size(140, 25);
            this.lbl_Baslik.TabIndex = 29;
            this.lbl_Baslik.Text = "Yeni Reçete";
            this.lbl_Baslik.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // pic_UstTaraf
            // 
            this.pic_UstTaraf.BackColor = System.Drawing.Color.DimGray;
            this.pic_UstTaraf.Location = new System.Drawing.Point(0, 12);
            this.pic_UstTaraf.Name = "pic_UstTaraf";
            this.pic_UstTaraf.Size = new System.Drawing.Size(1024, 50);
            this.pic_UstTaraf.TabIndex = 28;
            this.pic_UstTaraf.TabStop = false;
            // 
            // cmb_HastaTcKimlikNo
            // 
            this.cmb_HastaTcKimlikNo.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.cmb_HastaTcKimlikNo.DataSource = this.patientlistBindingSource;
            this.cmb_HastaTcKimlikNo.DisplayMember = "TC_Kimlik_Numarası";
            this.cmb_HastaTcKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_HastaTcKimlikNo.FormattingEnabled = true;
            this.cmb_HastaTcKimlikNo.Location = new System.Drawing.Point(472, 97);
            this.cmb_HastaTcKimlikNo.MaxLength = 11;
            this.cmb_HastaTcKimlikNo.Name = "cmb_HastaTcKimlikNo";
            this.cmb_HastaTcKimlikNo.Size = new System.Drawing.Size(219, 30);
            this.cmb_HastaTcKimlikNo.TabIndex = 47;
            // 
            // patientlistBindingSource
            // 
            this.patientlistBindingSource.DataMember = "patientlist";
            this.patientlistBindingSource.DataSource = this.veritabanıHasta;
            // 
            // veritabanıHasta
            // 
            this.veritabanıHasta.DataSetName = "VeritabanıHasta";
            this.veritabanıHasta.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
            // 
            // lbl_TcKimlikNo
            // 
            this.lbl_TcKimlikNo.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_TcKimlikNo.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_TcKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_TcKimlikNo.ForeColor = System.Drawing.Color.White;
            this.lbl_TcKimlikNo.Location = new System.Drawing.Point(284, 100);
            this.lbl_TcKimlikNo.Name = "lbl_TcKimlikNo";
            this.lbl_TcKimlikNo.Size = new System.Drawing.Size(179, 22);
            this.lbl_TcKimlikNo.TabIndex = 46;
            this.lbl_TcKimlikNo.Text = "TC Kimlik Numarası";
            this.lbl_TcKimlikNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // picİkinciSerit
            // 
            this.picİkinciSerit.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.picİkinciSerit.Location = new System.Drawing.Point(0, 78);
            this.picİkinciSerit.Name = "picİkinciSerit";
            this.picİkinciSerit.Size = new System.Drawing.Size(1024, 70);
            this.picİkinciSerit.TabIndex = 45;
            this.picİkinciSerit.TabStop = false;
            // 
            // pic_AltTaraf
            // 
            this.pic_AltTaraf.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.pic_AltTaraf.Location = new System.Drawing.Point(12, 165);
            this.pic_AltTaraf.Name = "pic_AltTaraf";
            this.pic_AltTaraf.Size = new System.Drawing.Size(1000, 497);
            this.pic_AltTaraf.TabIndex = 48;
            this.pic_AltTaraf.TabStop = false;
            // 
            // lbl_İlacAd
            // 
            this.lbl_İlacAd.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_İlacAd.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_İlacAd.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_İlacAd.ForeColor = System.Drawing.Color.White;
            this.lbl_İlacAd.Location = new System.Drawing.Point(41, 192);
            this.lbl_İlacAd.Name = "lbl_İlacAd";
            this.lbl_İlacAd.Size = new System.Drawing.Size(262, 22);
            this.lbl_İlacAd.TabIndex = 46;
            this.lbl_İlacAd.Text = "İlaç Adı";
            this.lbl_İlacAd.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_İlacKullanımSekli
            // 
            this.lbl_İlacKullanımSekli.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_İlacKullanımSekli.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_İlacKullanımSekli.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_İlacKullanımSekli.ForeColor = System.Drawing.Color.White;
            this.lbl_İlacKullanımSekli.Location = new System.Drawing.Point(321, 191);
            this.lbl_İlacKullanımSekli.Name = "lbl_İlacKullanımSekli";
            this.lbl_İlacKullanımSekli.Size = new System.Drawing.Size(192, 22);
            this.lbl_İlacKullanımSekli.TabIndex = 46;
            this.lbl_İlacKullanımSekli.Text = "İlaç Kullanım Şekli";
            this.lbl_İlacKullanımSekli.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_KullanımPeriyodu
            // 
            this.lbl_KullanımPeriyodu.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_KullanımPeriyodu.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_KullanımPeriyodu.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_KullanımPeriyodu.ForeColor = System.Drawing.Color.White;
            this.lbl_KullanımPeriyodu.Location = new System.Drawing.Point(528, 181);
            this.lbl_KullanımPeriyodu.Name = "lbl_KullanımPeriyodu";
            this.lbl_KullanımPeriyodu.Size = new System.Drawing.Size(94, 44);
            this.lbl_KullanımPeriyodu.TabIndex = 46;
            this.lbl_KullanımPeriyodu.Text = "Kullanım Periyodu";
            this.lbl_KullanımPeriyodu.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_PerBirimi
            // 
            this.lbl_PerBirimi.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_PerBirimi.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_PerBirimi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_PerBirimi.ForeColor = System.Drawing.Color.White;
            this.lbl_PerBirimi.Location = new System.Drawing.Point(638, 191);
            this.lbl_PerBirimi.Name = "lbl_PerBirimi";
            this.lbl_PerBirimi.Size = new System.Drawing.Size(91, 22);
            this.lbl_PerBirimi.TabIndex = 46;
            this.lbl_PerBirimi.Text = "Per.Birimi";
            this.lbl_PerBirimi.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_KutuAdet
            // 
            this.lbl_KutuAdet.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_KutuAdet.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_KutuAdet.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_KutuAdet.ForeColor = System.Drawing.Color.White;
            this.lbl_KutuAdet.Location = new System.Drawing.Point(745, 179);
            this.lbl_KutuAdet.Name = "lbl_KutuAdet";
            this.lbl_KutuAdet.Size = new System.Drawing.Size(76, 46);
            this.lbl_KutuAdet.TabIndex = 46;
            this.lbl_KutuAdet.Text = "Kutu Adet";
            this.lbl_KutuAdet.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_PerAdet
            // 
            this.lbl_PerAdet.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_PerAdet.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_PerAdet.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_PerAdet.ForeColor = System.Drawing.Color.White;
            this.lbl_PerAdet.Location = new System.Drawing.Point(836, 191);
            this.lbl_PerAdet.Name = "lbl_PerAdet";
            this.lbl_PerAdet.Size = new System.Drawing.Size(76, 22);
            this.lbl_PerAdet.TabIndex = 46;
            this.lbl_PerAdet.Text = "P.Adet";
            this.lbl_PerAdet.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_PerDoz
            // 
            this.lbl_PerDoz.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_PerDoz.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_PerDoz.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_PerDoz.ForeColor = System.Drawing.Color.White;
            this.lbl_PerDoz.Location = new System.Drawing.Point(921, 191);
            this.lbl_PerDoz.Name = "lbl_PerDoz";
            this.lbl_PerDoz.Size = new System.Drawing.Size(76, 22);
            this.lbl_PerDoz.TabIndex = 46;
            this.lbl_PerDoz.Text = "P.Doz";
            this.lbl_PerDoz.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // txt_KullanımPeriyodu
            // 
            this.txt_KullanımPeriyodu.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txt_KullanımPeriyodu.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_KullanımPeriyodu.Location = new System.Drawing.Point(532, 613);
            this.txt_KullanımPeriyodu.MaxLength = 3;
            this.txt_KullanımPeriyodu.Name = "txt_KullanımPeriyodu";
            this.txt_KullanımPeriyodu.Size = new System.Drawing.Size(90, 23);
            this.txt_KullanımPeriyodu.TabIndex = 50;
            // 
            // txt_KutuAdeti
            // 
            this.txt_KutuAdeti.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txt_KutuAdeti.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_KutuAdeti.Location = new System.Drawing.Point(745, 613);
            this.txt_KutuAdeti.MaxLength = 3;
            this.txt_KutuAdeti.Name = "txt_KutuAdeti";
            this.txt_KutuAdeti.Size = new System.Drawing.Size(76, 23);
            this.txt_KutuAdeti.TabIndex = 50;
            // 
            // txt_PerAdet
            // 
            this.txt_PerAdet.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txt_PerAdet.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_PerAdet.Location = new System.Drawing.Point(836, 613);
            this.txt_PerAdet.MaxLength = 3;
            this.txt_PerAdet.Name = "txt_PerAdet";
            this.txt_PerAdet.Size = new System.Drawing.Size(76, 23);
            this.txt_PerAdet.TabIndex = 50;
            // 
            // txt_PerDoz
            // 
            this.txt_PerDoz.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txt_PerDoz.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_PerDoz.Location = new System.Drawing.Point(921, 613);
            this.txt_PerDoz.MaxLength = 3;
            this.txt_PerDoz.Name = "txt_PerDoz";
            this.txt_PerDoz.Size = new System.Drawing.Size(76, 23);
            this.txt_PerDoz.TabIndex = 50;
            // 
            // txt_İlacAd
            // 
            this.txt_İlacAd.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txt_İlacAd.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_İlacAd.Location = new System.Drawing.Point(45, 613);
            this.txt_İlacAd.MaxLength = 0;
            this.txt_İlacAd.Name = "txt_İlacAd";
            this.txt_İlacAd.Size = new System.Drawing.Size(258, 23);
            this.txt_İlacAd.TabIndex = 50;
            // 
            // txt_KullanımSekli
            // 
            this.txt_KullanımSekli.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txt_KullanımSekli.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_KullanımSekli.Location = new System.Drawing.Point(321, 613);
            this.txt_KullanımSekli.MaxLength = 0;
            this.txt_KullanımSekli.Name = "txt_KullanımSekli";
            this.txt_KullanımSekli.Size = new System.Drawing.Size(192, 23);
            this.txt_KullanımSekli.TabIndex = 50;
            // 
            // txt_PerBirimi
            // 
            this.txt_PerBirimi.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txt_PerBirimi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_PerBirimi.Location = new System.Drawing.Point(638, 613);
            this.txt_PerBirimi.MaxLength = 5;
            this.txt_PerBirimi.Name = "txt_PerBirimi";
            this.txt_PerBirimi.Size = new System.Drawing.Size(91, 23);
            this.txt_PerBirimi.TabIndex = 50;
            // 
            // list_İlacKullanımSekli
            // 
            this.list_İlacKullanımSekli.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.list_İlacKullanımSekli.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.list_İlacKullanımSekli.FormattingEnabled = true;
            this.list_İlacKullanımSekli.HorizontalScrollbar = true;
            this.list_İlacKullanımSekli.ItemHeight = 22;
            this.list_İlacKullanımSekli.Items.AddRange(new object[] {
            "Ağız İçi (Bukal)",
            "Cilt Altına",
            "Cilt Üzerine",
            "Cilt İçine",
            "Kemik İliği İçine",
            "Konjonktiva üzerine",
            "İntranazal",
            "İntratekal",
            "İntraplevral",
            "İntraperitoneal",
            "İntrakardiyak",
            "İntraartiküler",
            "İntrauterin",
            "İntravajinal",
            "İntravenöz",
            "İntraartiyel",
            "İntramüsküler",
            "İnhalasyon",
            "Oral",
            "Rektal",
            "Rektum ve Kolon içine",
            "Sublingual",
            "Transdermal"});
            this.list_İlacKullanımSekli.Location = new System.Drawing.Point(320, 236);
            this.list_İlacKullanımSekli.Name = "list_İlacKullanımSekli";
            this.list_İlacKullanımSekli.Size = new System.Drawing.Size(194, 352);
            this.list_İlacKullanımSekli.TabIndex = 51;
            this.list_İlacKullanımSekli.SelectedIndexChanged += new System.EventHandler(this.list_İlacKullanımSekli_SelectedIndexChanged);
            // 
            // list_İlacAd
            // 
            this.list_İlacAd.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.list_İlacAd.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.list_İlacAd.FormattingEnabled = true;
            this.list_İlacAd.HorizontalScrollbar = true;
            this.list_İlacAd.ItemHeight = 22;
            this.list_İlacAd.Items.AddRange(new object[] {
            "AFINITOR® 10 mg tablet",
            "AFINITOR® 2.5 mg tablet",
            "AFINITOR® 5 mg tablet",
            "ALOMIDE® % 0.1 steril göz damlası, çözelti",
            "AZARGA®",
            "AZOPT® %1 Steril Göz Damlası, Süspansiyon",
            "BETOPTIC® %0.5 Steril Göz Damlası, Çözelti",
            "BETOPTIC® S %0.25 Steril Göz Damlası, Süspansiyon",
            "CATAFLAM® 50 mg draje",
            "CERTICAN® 0.25 mg suda çözünür tablet",
            "CERTICAN® 0.25 mg tablet",
            "CERTICAN® 0.75 mg tablet",
            "CILOXAN® %0.3 oftalmik merhem",
            "CILOXAN® %0.3 Steril Göz Damlası, Çözelti",
            "CO-DİOVAN® 160 mg/12.5 mg film tablet",
            "CO-DİOVAN® 160 mg/25 mg film tablet",
            "CO-DİOVAN® 320 mg/ 25 mg film kaplı tablet",
            "CO-DİOVAN® 320 mg/12,5 mg film kaplı tablet",
            "CO-DİOVAN® 80 mg/12,5 mg film tablet",
            "DESFERAL® 500 mg IM/IV/SC enjeksiyon için liyofilize toz içeren flakon",
            "DIOVAN® 160 mg film tablet",
            "DIOVAN® 320 film tablet",
            "DIOVAN® 80 mg film tablet",
            "DUOTRAV® 40 mcg/ml + 5 mg/ml steril göz damlası, çözelti",
            "EXELON® 1,5 mg kapsül",
            "EXELON® 2 mg/ml oral solüsyon",
            "EXELON® 3 mg kapsül",
            "EXELON® 4,5 mg kapsül",
            "EXELON® 6 mg kapsül",
            "EXELON® PATCH 5 transdermal flaster",
            "EXELON®PATCH 10 transdermal flaster",
            "EXELON®PATCH 15 transdermal flaster",
            "EXFORGE® 5 mg/160 mg Film Kaplı Tablet",
            "EXFORGE®10 mg/160 mg Film Kaplı Tablet",
            "EXFORGE®HCT 10/160/25 mg Film Kaplı Tablet",
            "EXFORGE®HCT 5/160/25 mg Film Kaplı Tablet",
            "EXJADE® 125 mg suda dağılabilen tablet",
            "EXJADE® 250 mg suda dağılabilen tablet",
            "EXJADE® 500 mg suda dağılabilen tablet",
            "FEMARA® 2.5 mg film kaplı tablet",
            "FLAREX® %0.1 Steril Göz Damlası, Süspansiyon",
            "GALVUS MET® 50/1000 mg Film Kaplı Tablet",
            "GALVUS MET® 50/850 mg Film Kaplı Tablet",
            "GALVUS® 50 mg tablet",
            "GLIVEC® 100 mg film tablet",
            "GLIVEC® 400 mg film tablet",
            "ILARIS®150 mg/ml enjeksiyonluk çözelti",
            "ILARIS®150 mg/ml enjeksiyonluk çözelti için toz içeren flakon.",
            "JAKAVI® 10 mg Tablet",
            "JAKAVI® 15 mg Tablet",
            "JAKAVI® 20 mg Tablet",
            "JAKAVI® 5 mg Tablet",
            "LİORESAL®10 mg tablet",
            "LOPRESOR® 100 mg film kaplı tablet",
            "LOPRESOR® SR 200 divitab",
            "LUCENTIS® 10 mg/ml enjeksiyonluk çözelti içeren flakon",
            "LUCENTIS® 10 mg/ml Enjeksiyonluk Çözelti İçeren Kullanıma Hazır Enjektör",
            "MAXIDEX® % 0.1 Steril Oftalmik Merhem",
            "MAXIDEX® % 0.1 Steril Oftalmik Süspansiyon",
            "MEKINIST® 0.5 mg Film Kaplı Tablet",
            "MEKINIST® 2 mg Film Kaplı Tablet",
            "MYFORTIC® 180 mg enterik kaplı tablet",
            "MYFORTIC® 360 mg enterik kaplı tablet",
            "NEVANAC®",
            "ONBREZ BREEZHALER® 150 mg inhaler kapsül",
            "PATANOL®",
            "REVOLADE® 12.5 mg film kaplı tablet",
            "REVOLADE® 25 mg film kaplı tablet",
            "REVOLADE® 50 mg film kaplı tablet",
            "RITALIN® 10 mg tablet",
            "RİTALİN® LA 10 mg modifiye salımlı kapsül",
            "RİTALİN® LA 20 mg modifiye salımlı kapsül",
            "RİTALİN® LA 30 mg modifiye salımlı kapsül",
            "RİTALİN® LA 40 mg modifiye salımlı kapsül",
            "RYDAPT® 25 mg yumuşak kapsül",
            "SANDİMMUN NEORAL® 100 mg Yumuşak Jelatin Kapsül",
            "SANDİMMUN NEORAL® 100 mg/ml Oral Çözelti",
            "SANDİMMUN NEORAL® 25 mg Yumuşak jelatin kapsül",
            "SANDİMMUN® 50 mg/ml Konsantre İnfüzyon Çözeltisi",
            "SANDOMIGRAN® Draje",
            "SANDOSTATİN LAR® 10 mg Enjeksiyonluk Süspansiyon için Toz ve Çözücü",
            "SANDOSTATİN LAR® 20 mg Enjeksiyonluk Süspansiyon için Toz ve Çözücü",
            "SANDOSTATİN LAR® 30 mg Enjeksiyonluk Süspansiyon için Toz ve Çözücü",
            "SANDOSTATİN® 0.1 mg / ml Enjeksiyonluk/İnfüzyonluk Çözelti",
            "SEBIVO® 600 mg film-kaplı tablet",
            "SİMBRİNZA® 10 mg/ml + 2 mg/ml Göz Damlası, Süspansiyon",
            "SIMULECT® Flakon",
            "STARLIX® 120 mg film kaplı tablet",
            "TAFINLAR® 50 mg kapsül",
            "TAFINLAR® 75 mg kapsül",
            "TASIGNA® 150 mg kapsül",
            "TASIGNA® 200 mg kapsül",
            "TEGRETOL® % 2 şurup",
            "TEGRETOL® 200 mg tablet",
            "TEGRETOL® CR 400 mg divitab",
            "TEGRETOL®CR 200 mg divitab",
            "TOBRADEX®",
            "TOBREX®",
            "TOBREX® Merhem",
            "TRAVATAN®",
            "TRILEPTAL® 300 mg Film Kaplı Tablet",
            "TRILEPTAL® 60 mg/ml Oral süspansiyon",
            "TRILEPTAL® 600 mg Film Kaplı Tablet",
            "TYKERB® 250 mg Film Kaplı Tablet",
            "VIGAMOX®",
            "VOLTAREN 100 mg uzatılmış salımlı tablet",
            "VOLTAREN® 50 mg enterik kaplı tablet (20 adet)",
            "VOLTAREN® SR 75 mg Film Tablet",
            "VOLTAREN®100 mg Süpozituvar",
            "VOTRIENT® 200 mg film kaplı tablet",
            "VOTRIENT® 400 mg film kaplı tablet",
            "VOTUBIA® 10 mg tablet",
            "VOTUBIA® 2 mg dağılabilir tablet",
            "VOTUBIA® 2.5 mg tablet",
            "VOTUBIA® 3 mg dağılabilir tablet",
            "VOTUBIA® 5 mg dağılabilir tablet",
            "VOTUBIA® 5 mg tablet",
            "XOLAİR® 150 mg/ml Enjeksiyonluk Çözelti İçeren Kullanıma Hazır Enjektör",
            "XOLAİR® 75 mg/ 0.5 ml Enjeksiyonluk Çözelti İçeren Kullanıma Hazır Enjektör",
            "XOLAIR®150 mg Enjeksiyonluk Çözelti için Toz içeren Flakon",
            "ZOMETA® 4 mg/5 ml i.v. infüzyon için konsantre çözelti",
            "ZYKADIA® 150 mg kapsül"});
            this.list_İlacAd.Location = new System.Drawing.Point(45, 234);
            this.list_İlacAd.Name = "list_İlacAd";
            this.list_İlacAd.Size = new System.Drawing.Size(258, 352);
            this.list_İlacAd.TabIndex = 52;
            this.list_İlacAd.SelectedIndexChanged += new System.EventHandler(this.list_İlacAd_SelectedIndexChanged);
            // 
            // list_KullanımPeriyodu
            // 
            this.list_KullanımPeriyodu.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.list_KullanımPeriyodu.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.list_KullanımPeriyodu.FormattingEnabled = true;
            this.list_KullanımPeriyodu.HorizontalScrollbar = true;
            this.list_KullanımPeriyodu.ItemHeight = 22;
            this.list_KullanımPeriyodu.Items.AddRange(new object[] {
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16"});
            this.list_KullanımPeriyodu.Location = new System.Drawing.Point(532, 236);
            this.list_KullanımPeriyodu.Name = "list_KullanımPeriyodu";
            this.list_KullanımPeriyodu.Size = new System.Drawing.Size(90, 352);
            this.list_KullanımPeriyodu.TabIndex = 53;
            this.list_KullanımPeriyodu.SelectedIndexChanged += new System.EventHandler(this.list_KullanımPeriyodu_SelectedIndexChanged);
            // 
            // list_KutuAdet
            // 
            this.list_KutuAdet.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.list_KutuAdet.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.list_KutuAdet.FormattingEnabled = true;
            this.list_KutuAdet.HorizontalScrollbar = true;
            this.list_KutuAdet.ItemHeight = 22;
            this.list_KutuAdet.Items.AddRange(new object[] {
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16"});
            this.list_KutuAdet.Location = new System.Drawing.Point(745, 236);
            this.list_KutuAdet.Name = "list_KutuAdet";
            this.list_KutuAdet.Size = new System.Drawing.Size(76, 352);
            this.list_KutuAdet.TabIndex = 54;
            this.list_KutuAdet.SelectedIndexChanged += new System.EventHandler(this.list_KutuAdet_SelectedIndexChanged);
            // 
            // list_PerAdet
            // 
            this.list_PerAdet.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.list_PerAdet.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.list_PerAdet.FormattingEnabled = true;
            this.list_PerAdet.HorizontalScrollbar = true;
            this.list_PerAdet.ItemHeight = 22;
            this.list_PerAdet.Items.AddRange(new object[] {
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16"});
            this.list_PerAdet.Location = new System.Drawing.Point(836, 234);
            this.list_PerAdet.Name = "list_PerAdet";
            this.list_PerAdet.Size = new System.Drawing.Size(76, 352);
            this.list_PerAdet.TabIndex = 54;
            this.list_PerAdet.SelectedIndexChanged += new System.EventHandler(this.list_PerAdet_SelectedIndexChanged);
            // 
            // list_PerDoz
            // 
            this.list_PerDoz.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.list_PerDoz.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.list_PerDoz.FormattingEnabled = true;
            this.list_PerDoz.HorizontalScrollbar = true;
            this.list_PerDoz.ItemHeight = 22;
            this.list_PerDoz.Items.AddRange(new object[] {
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16"});
            this.list_PerDoz.Location = new System.Drawing.Point(921, 234);
            this.list_PerDoz.Name = "list_PerDoz";
            this.list_PerDoz.Size = new System.Drawing.Size(76, 352);
            this.list_PerDoz.TabIndex = 54;
            this.list_PerDoz.SelectedIndexChanged += new System.EventHandler(this.list_PerDoz_SelectedIndexChanged);
            // 
            // list_PerBirimi
            // 
            this.list_PerBirimi.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.list_PerBirimi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.list_PerBirimi.FormattingEnabled = true;
            this.list_PerBirimi.HorizontalScrollbar = true;
            this.list_PerBirimi.ItemHeight = 22;
            this.list_PerBirimi.Items.AddRange(new object[] {
            "Gün",
            "Hafta",
            "Ay",
            "Yıl"});
            this.list_PerBirimi.Location = new System.Drawing.Point(638, 236);
            this.list_PerBirimi.Name = "list_PerBirimi";
            this.list_PerBirimi.Size = new System.Drawing.Size(91, 352);
            this.list_PerBirimi.TabIndex = 54;
            this.list_PerBirimi.SelectedIndexChanged += new System.EventHandler(this.list_PerBirimi_SelectedIndexChanged);
            // 
            // patientlistTableAdapter
            // 
            this.patientlistTableAdapter.ClearBeforeFill = true;
            // 
            // frm_YeniReçeteEkranı
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1024, 768);
            this.ControlBox = false;
            this.Controls.Add(this.list_PerDoz);
            this.Controls.Add(this.list_PerAdet);
            this.Controls.Add(this.list_PerBirimi);
            this.Controls.Add(this.list_KutuAdet);
            this.Controls.Add(this.list_KullanımPeriyodu);
            this.Controls.Add(this.list_İlacAd);
            this.Controls.Add(this.list_İlacKullanımSekli);
            this.Controls.Add(this.txt_PerDoz);
            this.Controls.Add(this.txt_PerAdet);
            this.Controls.Add(this.txt_KutuAdeti);
            this.Controls.Add(this.txt_PerBirimi);
            this.Controls.Add(this.txt_KullanımSekli);
            this.Controls.Add(this.txt_İlacAd);
            this.Controls.Add(this.txt_KullanımPeriyodu);
            this.Controls.Add(this.cmb_HastaTcKimlikNo);
            this.Controls.Add(this.lbl_PerDoz);
            this.Controls.Add(this.lbl_PerAdet);
            this.Controls.Add(this.lbl_KutuAdet);
            this.Controls.Add(this.lbl_PerBirimi);
            this.Controls.Add(this.lbl_KullanımPeriyodu);
            this.Controls.Add(this.lbl_İlacKullanımSekli);
            this.Controls.Add(this.lbl_İlacAd);
            this.Controls.Add(this.lbl_TcKimlikNo);
            this.Controls.Add(this.picİkinciSerit);
            this.Controls.Add(this.btn_Kaydet);
            this.Controls.Add(this.btn_İptal);
            this.Controls.Add(this.lbl_Baslik);
            this.Controls.Add(this.pic_UstTaraf);
            this.Controls.Add(this.pic_AltTaraf);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frm_YeniReçeteEkranı";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "YeniReçeteYaz";
            this.Load += new System.EventHandler(this.frm_YeniReçeteEkranı_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.patientlistBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıHasta)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picİkinciSerit)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_AltTaraf)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Button btn_Kaydet;
        private System.Windows.Forms.Button btn_İptal;
        private System.Windows.Forms.Label lbl_Baslik;
        private System.Windows.Forms.PictureBox pic_UstTaraf;
        private System.Windows.Forms.ComboBox cmb_HastaTcKimlikNo;
        private System.Windows.Forms.Label lbl_TcKimlikNo;
        private System.Windows.Forms.PictureBox picİkinciSerit;
        private System.Windows.Forms.PictureBox pic_AltTaraf;
        private System.Windows.Forms.Label lbl_İlacAd;
        private System.Windows.Forms.Label lbl_İlacKullanımSekli;
        private System.Windows.Forms.Label lbl_KullanımPeriyodu;
        private System.Windows.Forms.Label lbl_PerBirimi;
        private System.Windows.Forms.Label lbl_KutuAdet;
        private System.Windows.Forms.Label lbl_PerAdet;
        private System.Windows.Forms.Label lbl_PerDoz;
        private System.Windows.Forms.TextBox txt_KullanımPeriyodu;
        private System.Windows.Forms.TextBox txt_KutuAdeti;
        private System.Windows.Forms.TextBox txt_PerAdet;
        private System.Windows.Forms.TextBox txt_PerDoz;
        private System.Windows.Forms.TextBox txt_İlacAd;
        private System.Windows.Forms.TextBox txt_KullanımSekli;
        private System.Windows.Forms.TextBox txt_PerBirimi;
        private System.Windows.Forms.ListBox list_İlacKullanımSekli;
        private System.Windows.Forms.ListBox list_İlacAd;
        private System.Windows.Forms.ListBox list_KullanımPeriyodu;
        private System.Windows.Forms.ListBox list_KutuAdet;
        private System.Windows.Forms.ListBox list_PerAdet;
        private System.Windows.Forms.ListBox list_PerDoz;
        private System.Windows.Forms.ListBox list_PerBirimi;
        private VeritabanıHasta veritabanıHasta;
        private System.Windows.Forms.BindingSource patientlistBindingSource;
        private VeritabanıHastaTableAdapters.patientlistTableAdapter patientlistTableAdapter;
    }
}