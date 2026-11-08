namespace Hastane_Bilgi_Yönetim_Sistemi
{
    partial class frm_OdaAtamaEkranı
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
            this.lbl_Baslik = new System.Windows.Forms.Label();
            this.pic_UstTaraf = new System.Windows.Forms.PictureBox();
            this.pic_AltTaraf = new System.Windows.Forms.PictureBox();
            this.lbl_OdaNumarası = new System.Windows.Forms.Label();
            this.txt_OdaNumarası = new System.Windows.Forms.TextBox();
            this.lbl_HastaTcKimlikNo = new System.Windows.Forms.Label();
            this.dt_OdayaGirisTarihi = new System.Windows.Forms.DateTimePicker();
            this.lbl_OdayaGirisTarihi = new System.Windows.Forms.Label();
            this.dt_TahminiCikisTarihi = new System.Windows.Forms.DateTimePicker();
            this.lbl_TahminiCikisTarihi = new System.Windows.Forms.Label();
            this.btn_Kaydet = new System.Windows.Forms.Button();
            this.btn_İptal = new System.Windows.Forms.Button();
            this.cmb_HastaTcKimlikNo = new System.Windows.Forms.ComboBox();
            this.patientlistBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.veritabanıHasta = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıHasta();
            this.patientlistTableAdapter = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıHastaTableAdapters.patientlistTableAdapter();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_AltTaraf)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.patientlistBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıHasta)).BeginInit();
            this.SuspendLayout();
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
            this.lbl_Baslik.Location = new System.Drawing.Point(460, 24);
            this.lbl_Baslik.Name = "lbl_Baslik";
            this.lbl_Baslik.Size = new System.Drawing.Size(144, 25);
            this.lbl_Baslik.TabIndex = 14;
            this.lbl_Baslik.Text = "Oda Atama";
            this.lbl_Baslik.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // pic_UstTaraf
            // 
            this.pic_UstTaraf.BackColor = System.Drawing.Color.DimGray;
            this.pic_UstTaraf.Location = new System.Drawing.Point(0, 12);
            this.pic_UstTaraf.Name = "pic_UstTaraf";
            this.pic_UstTaraf.Size = new System.Drawing.Size(1024, 50);
            this.pic_UstTaraf.TabIndex = 13;
            this.pic_UstTaraf.TabStop = false;
            // 
            // pic_AltTaraf
            // 
            this.pic_AltTaraf.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.pic_AltTaraf.Location = new System.Drawing.Point(0, 90);
            this.pic_AltTaraf.Name = "pic_AltTaraf";
            this.pic_AltTaraf.Size = new System.Drawing.Size(1024, 151);
            this.pic_AltTaraf.TabIndex = 15;
            this.pic_AltTaraf.TabStop = false;
            // 
            // lbl_OdaNumarası
            // 
            this.lbl_OdaNumarası.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_OdaNumarası.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_OdaNumarası.ForeColor = System.Drawing.Color.White;
            this.lbl_OdaNumarası.Location = new System.Drawing.Point(103, 121);
            this.lbl_OdaNumarası.Name = "lbl_OdaNumarası";
            this.lbl_OdaNumarası.Size = new System.Drawing.Size(147, 22);
            this.lbl_OdaNumarası.TabIndex = 17;
            this.lbl_OdaNumarası.Text = "Oda Numarası";
            this.lbl_OdaNumarası.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // txt_OdaNumarası
            // 
            this.txt_OdaNumarası.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_OdaNumarası.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_OdaNumarası.ForeColor = System.Drawing.Color.Black;
            this.txt_OdaNumarası.Location = new System.Drawing.Point(256, 118);
            this.txt_OdaNumarası.MaxLength = 20;
            this.txt_OdaNumarası.Name = "txt_OdaNumarası";
            this.txt_OdaNumarası.Size = new System.Drawing.Size(180, 30);
            this.txt_OdaNumarası.TabIndex = 16;
            // 
            // lbl_HastaTcKimlikNo
            // 
            this.lbl_HastaTcKimlikNo.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_HastaTcKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_HastaTcKimlikNo.ForeColor = System.Drawing.Color.White;
            this.lbl_HastaTcKimlikNo.Location = new System.Drawing.Point(522, 121);
            this.lbl_HastaTcKimlikNo.Name = "lbl_HastaTcKimlikNo";
            this.lbl_HastaTcKimlikNo.Size = new System.Drawing.Size(235, 22);
            this.lbl_HastaTcKimlikNo.TabIndex = 17;
            this.lbl_HastaTcKimlikNo.Text = "Hasta TC Kimlik Numarası";
            this.lbl_HastaTcKimlikNo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // dt_OdayaGirisTarihi
            // 
            this.dt_OdayaGirisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.dt_OdayaGirisTarihi.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dt_OdayaGirisTarihi.Location = new System.Drawing.Point(256, 181);
            this.dt_OdayaGirisTarihi.Name = "dt_OdayaGirisTarihi";
            this.dt_OdayaGirisTarihi.Size = new System.Drawing.Size(180, 30);
            this.dt_OdayaGirisTarihi.TabIndex = 22;
            // 
            // lbl_OdayaGirisTarihi
            // 
            this.lbl_OdayaGirisTarihi.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_OdayaGirisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_OdayaGirisTarihi.ForeColor = System.Drawing.Color.White;
            this.lbl_OdayaGirisTarihi.Location = new System.Drawing.Point(76, 184);
            this.lbl_OdayaGirisTarihi.Name = "lbl_OdayaGirisTarihi";
            this.lbl_OdayaGirisTarihi.Size = new System.Drawing.Size(174, 22);
            this.lbl_OdayaGirisTarihi.TabIndex = 21;
            this.lbl_OdayaGirisTarihi.Text = "Odaya Giriş Tarihi";
            this.lbl_OdayaGirisTarihi.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // dt_TahminiCikisTarihi
            // 
            this.dt_TahminiCikisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.dt_TahminiCikisTarihi.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.dt_TahminiCikisTarihi.Location = new System.Drawing.Point(763, 181);
            this.dt_TahminiCikisTarihi.Name = "dt_TahminiCikisTarihi";
            this.dt_TahminiCikisTarihi.Size = new System.Drawing.Size(180, 30);
            this.dt_TahminiCikisTarihi.TabIndex = 24;
            // 
            // lbl_TahminiCikisTarihi
            // 
            this.lbl_TahminiCikisTarihi.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_TahminiCikisTarihi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_TahminiCikisTarihi.ForeColor = System.Drawing.Color.White;
            this.lbl_TahminiCikisTarihi.Location = new System.Drawing.Point(583, 184);
            this.lbl_TahminiCikisTarihi.Name = "lbl_TahminiCikisTarihi";
            this.lbl_TahminiCikisTarihi.Size = new System.Drawing.Size(174, 22);
            this.lbl_TahminiCikisTarihi.TabIndex = 23;
            this.lbl_TahminiCikisTarihi.Text = "Tahmini Çıkış Tarihi";
            this.lbl_TahminiCikisTarihi.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
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
            this.btn_Kaydet.Location = new System.Drawing.Point(536, 266);
            this.btn_Kaydet.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Kaydet.Name = "btn_Kaydet";
            this.btn_Kaydet.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_Kaydet.Size = new System.Drawing.Size(85, 33);
            this.btn_Kaydet.TabIndex = 25;
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
            this.btn_İptal.Location = new System.Drawing.Point(427, 266);
            this.btn_İptal.Margin = new System.Windows.Forms.Padding(0);
            this.btn_İptal.Name = "btn_İptal";
            this.btn_İptal.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_İptal.Size = new System.Drawing.Size(85, 33);
            this.btn_İptal.TabIndex = 26;
            this.btn_İptal.Text = "İptal";
            this.btn_İptal.UseVisualStyleBackColor = false;
            this.btn_İptal.Click += new System.EventHandler(this.btn_İptal_Click);
            // 
            // cmb_HastaTcKimlikNo
            // 
            this.cmb_HastaTcKimlikNo.DataSource = this.patientlistBindingSource;
            this.cmb_HastaTcKimlikNo.DisplayMember = "TC_Kimlik_Numarası";
            this.cmb_HastaTcKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.cmb_HastaTcKimlikNo.FormattingEnabled = true;
            this.cmb_HastaTcKimlikNo.Location = new System.Drawing.Point(763, 118);
            this.cmb_HastaTcKimlikNo.MaxLength = 11;
            this.cmb_HastaTcKimlikNo.Name = "cmb_HastaTcKimlikNo";
            this.cmb_HastaTcKimlikNo.Size = new System.Drawing.Size(180, 30);
            this.cmb_HastaTcKimlikNo.TabIndex = 27;
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
            // patientlistTableAdapter
            // 
            this.patientlistTableAdapter.ClearBeforeFill = true;
            // 
            // frm_OdaAtamaEkranı
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1024, 322);
            this.ControlBox = false;
            this.Controls.Add(this.cmb_HastaTcKimlikNo);
            this.Controls.Add(this.btn_Kaydet);
            this.Controls.Add(this.btn_İptal);
            this.Controls.Add(this.dt_TahminiCikisTarihi);
            this.Controls.Add(this.lbl_TahminiCikisTarihi);
            this.Controls.Add(this.dt_OdayaGirisTarihi);
            this.Controls.Add(this.lbl_OdayaGirisTarihi);
            this.Controls.Add(this.lbl_HastaTcKimlikNo);
            this.Controls.Add(this.lbl_OdaNumarası);
            this.Controls.Add(this.txt_OdaNumarası);
            this.Controls.Add(this.pic_AltTaraf);
            this.Controls.Add(this.lbl_Baslik);
            this.Controls.Add(this.pic_UstTaraf);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frm_OdaAtamaEkranı";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "YeniOdaAtama";
            this.Load += new System.EventHandler(this.frm_OdaAtamaEkranı_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_AltTaraf)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.patientlistBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıHasta)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lbl_Baslik;
        private System.Windows.Forms.PictureBox pic_UstTaraf;
        private System.Windows.Forms.PictureBox pic_AltTaraf;
        private System.Windows.Forms.Label lbl_OdaNumarası;
        private System.Windows.Forms.TextBox txt_OdaNumarası;
        private System.Windows.Forms.Label lbl_HastaTcKimlikNo;
        private System.Windows.Forms.DateTimePicker dt_OdayaGirisTarihi;
        private System.Windows.Forms.Label lbl_OdayaGirisTarihi;
        private System.Windows.Forms.DateTimePicker dt_TahminiCikisTarihi;
        private System.Windows.Forms.Label lbl_TahminiCikisTarihi;
        private System.Windows.Forms.Button btn_Kaydet;
        private System.Windows.Forms.Button btn_İptal;
        private System.Windows.Forms.ComboBox cmb_HastaTcKimlikNo;
        private VeritabanıHasta veritabanıHasta;
        private System.Windows.Forms.BindingSource patientlistBindingSource;
        private VeritabanıHastaTableAdapters.patientlistTableAdapter patientlistTableAdapter;
    }
}