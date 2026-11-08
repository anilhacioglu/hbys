namespace Hastane_Bilgi_Yönetim_Sistemi
{
    partial class frm_GirisEkran
    {
        /// <summary>
        ///Gerekli tasarımcı değişkeni.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///Kullanılan tüm kaynakları temizleyin.
        /// </summary>
        ///<param name="disposing">yönetilen kaynaklar dispose edilmeliyse doğru; aksi halde yanlış.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer üretilen kod

        /// <summary>
        /// Tasarımcı desteği için gerekli metot - bu metodun 
        ///içeriğini kod düzenleyici ile değiştirmeyin.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.btn_Giris = new System.Windows.Forms.Button();
            this.lbl_Baslik = new System.Windows.Forms.Label();
            this.txt_KullaniciAdi = new System.Windows.Forms.TextBox();
            this.lbl_Sifre = new System.Windows.Forms.Label();
            this.lbl_KullaniciAdi = new System.Windows.Forms.Label();
            this.btn_Cikis = new System.Windows.Forms.Button();
            this.txt_Sifre = new System.Windows.Forms.TextBox();
            this.tableBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.lbl_Hata = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.tableBindingSource)).BeginInit();
            this.SuspendLayout();
            // 
            // btn_Giris
            // 
            this.btn_Giris.BackColor = System.Drawing.Color.White;
            this.btn_Giris.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btn_Giris.FlatAppearance.BorderColor = System.Drawing.Color.LightSkyBlue;
            this.btn_Giris.FlatAppearance.MouseDownBackColor = System.Drawing.Color.Transparent;
            this.btn_Giris.FlatAppearance.MouseOverBackColor = System.Drawing.Color.Transparent;
            this.btn_Giris.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_Giris.Font = new System.Drawing.Font("Century Gothic", 12F);
            this.btn_Giris.ForeColor = System.Drawing.Color.LightSkyBlue;
            this.btn_Giris.Location = new System.Drawing.Point(928, 418);
            this.btn_Giris.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Giris.Name = "btn_Giris";
            this.btn_Giris.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_Giris.Size = new System.Drawing.Size(242, 33);
            this.btn_Giris.TabIndex = 3;
            this.btn_Giris.Text = "Giriş Yap";
            this.btn_Giris.UseVisualStyleBackColor = false;
            this.btn_Giris.Click += new System.EventHandler(this.btn_Giris_Click);
            // 
            // lbl_Baslik
            // 
            this.lbl_Baslik.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_Baslik.AutoSize = true;
            this.lbl_Baslik.Font = new System.Drawing.Font("Century Gothic", 16F);
            this.lbl_Baslik.Location = new System.Drawing.Point(908, 222);
            this.lbl_Baslik.Name = "lbl_Baslik";
            this.lbl_Baslik.Size = new System.Drawing.Size(290, 25);
            this.lbl_Baslik.TabIndex = 0;
            this.lbl_Baslik.Text = "HASTANE PERSONEL GİRİŞİ";
            this.lbl_Baslik.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // txt_KullaniciAdi
            // 
            this.txt_KullaniciAdi.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_KullaniciAdi.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_KullaniciAdi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_KullaniciAdi.ForeColor = System.Drawing.Color.Black;
            this.txt_KullaniciAdi.Location = new System.Drawing.Point(856, 347);
            this.txt_KullaniciAdi.MaxLength = 20;
            this.txt_KullaniciAdi.Name = "txt_KullaniciAdi";
            this.txt_KullaniciAdi.Size = new System.Drawing.Size(190, 30);
            this.txt_KullaniciAdi.TabIndex = 1;
            // 
            // lbl_Sifre
            // 
            this.lbl_Sifre.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_Sifre.AutoSize = true;
            this.lbl_Sifre.BackColor = System.Drawing.Color.Transparent;
            this.lbl_Sifre.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_Sifre.ForeColor = System.Drawing.Color.DimGray;
            this.lbl_Sifre.Location = new System.Drawing.Point(1122, 318);
            this.lbl_Sifre.Name = "lbl_Sifre";
            this.lbl_Sifre.Size = new System.Drawing.Size(46, 22);
            this.lbl_Sifre.TabIndex = 0;
            this.lbl_Sifre.Text = "Şifre";
            this.lbl_Sifre.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // lbl_KullaniciAdi
            // 
            this.lbl_KullaniciAdi.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_KullaniciAdi.AutoSize = true;
            this.lbl_KullaniciAdi.BackColor = System.Drawing.Color.Transparent;
            this.lbl_KullaniciAdi.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_KullaniciAdi.ForeColor = System.Drawing.Color.DimGray;
            this.lbl_KullaniciAdi.Location = new System.Drawing.Point(894, 318);
            this.lbl_KullaniciAdi.Name = "lbl_KullaniciAdi";
            this.lbl_KullaniciAdi.Size = new System.Drawing.Size(118, 22);
            this.lbl_KullaniciAdi.TabIndex = 0;
            this.lbl_KullaniciAdi.Text = "Kullanıcı Adı";
            this.lbl_KullaniciAdi.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // btn_Cikis
            // 
            this.btn_Cikis.BackColor = System.Drawing.Color.White;
            this.btn_Cikis.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btn_Cikis.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.btn_Cikis.FlatAppearance.BorderSize = 0;
            this.btn_Cikis.FlatAppearance.MouseDownBackColor = System.Drawing.Color.Transparent;
            this.btn_Cikis.FlatAppearance.MouseOverBackColor = System.Drawing.Color.Transparent;
            this.btn_Cikis.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_Cikis.Font = new System.Drawing.Font("Century Gothic", 10F);
            this.btn_Cikis.ForeColor = System.Drawing.Color.LightSkyBlue;
            this.btn_Cikis.Location = new System.Drawing.Point(928, 481);
            this.btn_Cikis.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Cikis.Name = "btn_Cikis";
            this.btn_Cikis.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_Cikis.Size = new System.Drawing.Size(242, 33);
            this.btn_Cikis.TabIndex = 4;
            this.btn_Cikis.Text = "Çıkış";
            this.btn_Cikis.UseVisualStyleBackColor = false;
            this.btn_Cikis.Click += new System.EventHandler(this.btn_Cikis_Click);
            // 
            // txt_Sifre
            // 
            this.txt_Sifre.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_Sifre.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_Sifre.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_Sifre.ForeColor = System.Drawing.Color.Black;
            this.txt_Sifre.Location = new System.Drawing.Point(1052, 347);
            this.txt_Sifre.MaxLength = 20;
            this.txt_Sifre.Name = "txt_Sifre";
            this.txt_Sifre.PasswordChar = '*';
            this.txt_Sifre.Size = new System.Drawing.Size(190, 30);
            this.txt_Sifre.TabIndex = 2;
            this.txt_Sifre.UseSystemPasswordChar = true;
            // 
            // lbl_Hata
            // 
            this.lbl_Hata.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_Hata.AutoSize = true;
            this.lbl_Hata.Font = new System.Drawing.Font("Century Gothic", 12F);
            this.lbl_Hata.ForeColor = System.Drawing.Color.White;
            this.lbl_Hata.Location = new System.Drawing.Point(928, 276);
            this.lbl_Hata.Name = "lbl_Hata";
            this.lbl_Hata.Size = new System.Drawing.Size(242, 21);
            this.lbl_Hata.TabIndex = 0;
            this.lbl_Hata.Text = "Kullanıcı Adı veya Şifresi Yanlış!";
            this.lbl_Hata.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // frm_GirisEkran
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1280, 720);
            this.ControlBox = false;
            this.Controls.Add(this.txt_KullaniciAdi);
            this.Controls.Add(this.txt_Sifre);
            this.Controls.Add(this.btn_Giris);
            this.Controls.Add(this.lbl_Hata);
            this.Controls.Add(this.btn_Cikis);
            this.Controls.Add(this.lbl_Sifre);
            this.Controls.Add(this.lbl_KullaniciAdi);
            this.Controls.Add(this.lbl_Baslik);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frm_GirisEkran";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Giriş Ekranı";
            ((System.ComponentModel.ISupportInitialize)(this.tableBindingSource)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.BindingSource tableBindingSource;
        private System.Windows.Forms.Label lbl_Baslik;
        private System.Windows.Forms.TextBox txt_KullaniciAdi;
        private System.Windows.Forms.Button btn_Giris;
        private System.Windows.Forms.Label lbl_Sifre;
        private System.Windows.Forms.Label lbl_KullaniciAdi;
        private System.Windows.Forms.Button btn_Cikis;
        private System.Windows.Forms.TextBox txt_Sifre;
        private System.Windows.Forms.Label lbl_Hata;
    }
}

