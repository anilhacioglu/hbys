namespace Hastane_Bilgi_Yönetim_Sistemi
{
    partial class frm_OdaGüncellemeEkranı
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
            this.cmb_TcKimlikNo = new System.Windows.Forms.ComboBox();
            this.patientlistBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.veritabanıHasta = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıHasta();
            this.btn_Guncelle = new System.Windows.Forms.Button();
            this.btn_İptal = new System.Windows.Forms.Button();
            this.dt_OdadanCikisTarihi = new System.Windows.Forms.DateTimePicker();
            this.lbl_OdadanCikisTarihi = new System.Windows.Forms.Label();
            this.dt_OdayaGirisTarihi = new System.Windows.Forms.DateTimePicker();
            this.lblOdayaGirisTarihi = new System.Windows.Forms.Label();
            this.lbl_TcKimlikNo = new System.Windows.Forms.Label();
            this.lbl_OdaNo = new System.Windows.Forms.Label();
            this.txt_OdaNo = new System.Windows.Forms.TextBox();
            this.lbl_Baslik = new System.Windows.Forms.Label();
            this.pic_AltTaraf = new System.Windows.Forms.PictureBox();
            this.pic_UstTaraf = new System.Windows.Forms.PictureBox();
            this.patientlistTableAdapter = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıHastaTableAdapters.patientlistTableAdapter();
            ((System.ComponentModel.ISupportInitialize)(this.patientlistBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıHasta)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_AltTaraf)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).BeginInit();
            this.SuspendLayout();
            // 
            // cmb_TcKimlikNo
            // 
            this.cmb_TcKimlikNo.DataSource = this.patientlistBindingSource;
            this.cmb_TcKimlikNo.DisplayMember = "TC_Kimlik_Numarası";
            this.cmb_TcKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_TcKimlikNo.FormattingEnabled = true;
            this.cmb_TcKimlikNo.Location = new System.Drawing.Point(763, 119);
            this.cmb_TcKimlikNo.MaxLength = 11;
            this.cmb_TcKimlikNo.Name = "cmb_TcKimlikNo";
            this.cmb_TcKimlikNo.Size = new System.Drawing.Size(180, 30);
            this.cmb_TcKimlikNo.TabIndex = 40;
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
            this.btn_Guncelle.Location = new System.Drawing.Point(536, 267);
            this.btn_Guncelle.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Guncelle.Name = "btn_Guncelle";
            this.btn_Guncelle.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_Guncelle.Size = new System.Drawing.Size(85, 33);
            this.btn_Guncelle.TabIndex = 38;
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
            this.btn_İptal.Location = new System.Drawing.Point(427, 267);
            this.btn_İptal.Margin = new System.Windows.Forms.Padding(0);
            this.btn_İptal.Name = "btn_İptal";
            this.btn_İptal.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_İptal.Size = new System.Drawing.Size(85, 33);
            this.btn_İptal.TabIndex = 39;
            this.btn_İptal.Text = "İptal";
            this.btn_İptal.UseVisualStyleBackColor = false;
            this.btn_İptal.Click += new System.EventHandler(this.btn_İptal_Click);
            // 
            // dt_OdadanCikisTarihi
            // 
            this.dt_OdadanCikisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.dt_OdadanCikisTarihi.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dt_OdadanCikisTarihi.Location = new System.Drawing.Point(763, 182);
            this.dt_OdadanCikisTarihi.Name = "dt_OdadanCikisTarihi";
            this.dt_OdadanCikisTarihi.Size = new System.Drawing.Size(180, 30);
            this.dt_OdadanCikisTarihi.TabIndex = 37;
            // 
            // lbl_OdadanCikisTarihi
            // 
            this.lbl_OdadanCikisTarihi.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_OdadanCikisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_OdadanCikisTarihi.ForeColor = System.Drawing.Color.White;
            this.lbl_OdadanCikisTarihi.Location = new System.Drawing.Point(583, 185);
            this.lbl_OdadanCikisTarihi.Name = "lbl_OdadanCikisTarihi";
            this.lbl_OdadanCikisTarihi.Size = new System.Drawing.Size(174, 22);
            this.lbl_OdadanCikisTarihi.TabIndex = 36;
            this.lbl_OdadanCikisTarihi.Text = "Tahmini Çıkış Tarihi";
            this.lbl_OdadanCikisTarihi.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // dt_OdayaGirisTarihi
            // 
            this.dt_OdayaGirisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.dt_OdayaGirisTarihi.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dt_OdayaGirisTarihi.Location = new System.Drawing.Point(256, 182);
            this.dt_OdayaGirisTarihi.Name = "dt_OdayaGirisTarihi";
            this.dt_OdayaGirisTarihi.Size = new System.Drawing.Size(180, 30);
            this.dt_OdayaGirisTarihi.TabIndex = 35;
            // 
            // lblOdayaGirisTarihi
            // 
            this.lblOdayaGirisTarihi.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lblOdayaGirisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lblOdayaGirisTarihi.ForeColor = System.Drawing.Color.White;
            this.lblOdayaGirisTarihi.Location = new System.Drawing.Point(76, 185);
            this.lblOdayaGirisTarihi.Name = "lblOdayaGirisTarihi";
            this.lblOdayaGirisTarihi.Size = new System.Drawing.Size(174, 22);
            this.lblOdayaGirisTarihi.TabIndex = 34;
            this.lblOdayaGirisTarihi.Text = "Odaya Giriş Tarihi";
            this.lblOdayaGirisTarihi.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_TcKimlikNo
            // 
            this.lbl_TcKimlikNo.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_TcKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_TcKimlikNo.ForeColor = System.Drawing.Color.White;
            this.lbl_TcKimlikNo.Location = new System.Drawing.Point(522, 122);
            this.lbl_TcKimlikNo.Name = "lbl_TcKimlikNo";
            this.lbl_TcKimlikNo.Size = new System.Drawing.Size(235, 22);
            this.lbl_TcKimlikNo.TabIndex = 32;
            this.lbl_TcKimlikNo.Text = "Hasta TC Kimlik Numarası";
            this.lbl_TcKimlikNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lbl_OdaNo
            // 
            this.lbl_OdaNo.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_OdaNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_OdaNo.ForeColor = System.Drawing.Color.White;
            this.lbl_OdaNo.Location = new System.Drawing.Point(103, 122);
            this.lbl_OdaNo.Name = "lbl_OdaNo";
            this.lbl_OdaNo.Size = new System.Drawing.Size(147, 22);
            this.lbl_OdaNo.TabIndex = 33;
            this.lbl_OdaNo.Text = "Oda Numarası";
            this.lbl_OdaNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // txt_OdaNo
            // 
            this.txt_OdaNo.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_OdaNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_OdaNo.ForeColor = System.Drawing.Color.Black;
            this.txt_OdaNo.Location = new System.Drawing.Point(256, 119);
            this.txt_OdaNo.MaxLength = 20;
            this.txt_OdaNo.Name = "txt_OdaNo";
            this.txt_OdaNo.Size = new System.Drawing.Size(180, 30);
            this.txt_OdaNo.TabIndex = 31;
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
            this.lbl_Baslik.Location = new System.Drawing.Point(433, 25);
            this.lbl_Baslik.Name = "lbl_Baslik";
            this.lbl_Baslik.Size = new System.Drawing.Size(202, 25);
            this.lbl_Baslik.TabIndex = 29;
            this.lbl_Baslik.Text = "Oda Güncelleme";
            this.lbl_Baslik.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // pic_AltTaraf
            // 
            this.pic_AltTaraf.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.pic_AltTaraf.Location = new System.Drawing.Point(0, 91);
            this.pic_AltTaraf.Name = "pic_AltTaraf";
            this.pic_AltTaraf.Size = new System.Drawing.Size(1024, 151);
            this.pic_AltTaraf.TabIndex = 30;
            this.pic_AltTaraf.TabStop = false;
            // 
            // pic_UstTaraf
            // 
            this.pic_UstTaraf.BackColor = System.Drawing.Color.DimGray;
            this.pic_UstTaraf.Location = new System.Drawing.Point(0, 13);
            this.pic_UstTaraf.Name = "pic_UstTaraf";
            this.pic_UstTaraf.Size = new System.Drawing.Size(1024, 50);
            this.pic_UstTaraf.TabIndex = 28;
            this.pic_UstTaraf.TabStop = false;
            // 
            // patientlistTableAdapter
            // 
            this.patientlistTableAdapter.ClearBeforeFill = true;
            // 
            // frm_OdaGüncellemeEkranı
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1024, 322);
            this.ControlBox = false;
            this.Controls.Add(this.cmb_TcKimlikNo);
            this.Controls.Add(this.btn_Guncelle);
            this.Controls.Add(this.btn_İptal);
            this.Controls.Add(this.dt_OdadanCikisTarihi);
            this.Controls.Add(this.lbl_OdadanCikisTarihi);
            this.Controls.Add(this.dt_OdayaGirisTarihi);
            this.Controls.Add(this.lblOdayaGirisTarihi);
            this.Controls.Add(this.lbl_TcKimlikNo);
            this.Controls.Add(this.lbl_OdaNo);
            this.Controls.Add(this.txt_OdaNo);
            this.Controls.Add(this.pic_AltTaraf);
            this.Controls.Add(this.lbl_Baslik);
            this.Controls.Add(this.pic_UstTaraf);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frm_OdaGüncellemeEkranı";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "GüncellemeEkranıOda";
            this.Load += new System.EventHandler(this.frm_OdaGüncellemeEkranı_Load);
            ((System.ComponentModel.ISupportInitialize)(this.patientlistBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıHasta)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_AltTaraf)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ComboBox cmb_TcKimlikNo;
        private System.Windows.Forms.Button btn_Guncelle;
        private System.Windows.Forms.Button btn_İptal;
        private System.Windows.Forms.DateTimePicker dt_OdadanCikisTarihi;
        private System.Windows.Forms.Label lbl_OdadanCikisTarihi;
        private System.Windows.Forms.DateTimePicker dt_OdayaGirisTarihi;
        private System.Windows.Forms.Label lblOdayaGirisTarihi;
        private System.Windows.Forms.Label lbl_TcKimlikNo;
        private System.Windows.Forms.Label lbl_OdaNo;
        private System.Windows.Forms.TextBox txt_OdaNo;
        private System.Windows.Forms.PictureBox pic_AltTaraf;
        private System.Windows.Forms.Label lbl_Baslik;
        private System.Windows.Forms.PictureBox pic_UstTaraf;
        private VeritabanıHasta veritabanıHasta;
        private System.Windows.Forms.BindingSource patientlistBindingSource;
        private VeritabanıHastaTableAdapters.patientlistTableAdapter patientlistTableAdapter;
    }
}