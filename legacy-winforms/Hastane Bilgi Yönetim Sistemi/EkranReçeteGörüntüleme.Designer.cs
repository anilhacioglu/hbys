namespace Hastane_Bilgi_Yönetim_Sistemi
{
    partial class frm_ReçeteGörüntüle
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            this.lbl_TcKimlik = new System.Windows.Forms.Label();
            this.lbl_Baslik = new System.Windows.Forms.Label();
            this.pic_OrtaGri = new System.Windows.Forms.PictureBox();
            this.pic_UstTaraf = new System.Windows.Forms.PictureBox();
            this.data_Reçete = new System.Windows.Forms.DataGridView();
            this.reçeteNumarasıDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.tCKimlikNumarasıDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ilaçAdıDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.ilaçKullanımŞekliDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.kulPeriyoduDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.perBirimiDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.kutuAdetiDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.pAdetDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.pDozDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.reçetelistBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.veritabanıReçete = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıReçete();
            this.btn_İptal = new System.Windows.Forms.Button();
            this.reçetelistTableAdapter = new Hastane_Bilgi_Yönetim_Sistemi.VeritabanıReçeteTableAdapters.reçetelistTableAdapter();
            this.btn_Arama = new System.Windows.Forms.Button();
            this.txt_HastaKimlikNo = new System.Windows.Forms.TextBox();
            this.lbl_ReçeteNo = new System.Windows.Forms.Label();
            this.txt_Reçeteid = new System.Windows.Forms.TextBox();
            this.btn_Sil = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pic_OrtaGri)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.data_Reçete)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.reçetelistBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıReçete)).BeginInit();
            this.SuspendLayout();
            // 
            // lbl_TcKimlik
            // 
            this.lbl_TcKimlik.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.lbl_TcKimlik.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_TcKimlik.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.lbl_TcKimlik.ForeColor = System.Drawing.Color.White;
            this.lbl_TcKimlik.Location = new System.Drawing.Point(67, 118);
            this.lbl_TcKimlik.Name = "lbl_TcKimlik";
            this.lbl_TcKimlik.Size = new System.Drawing.Size(179, 22);
            this.lbl_TcKimlik.TabIndex = 42;
            this.lbl_TcKimlik.Text = "TC Kimlik Numarası";
            this.lbl_TcKimlik.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
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
            this.lbl_Baslik.Location = new System.Drawing.Point(411, 24);
            this.lbl_Baslik.Name = "lbl_Baslik";
            this.lbl_Baslik.Size = new System.Drawing.Size(202, 25);
            this.lbl_Baslik.TabIndex = 38;
            this.lbl_Baslik.Text = "Reçete Görüntüle";
            this.lbl_Baslik.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // pic_OrtaGri
            // 
            this.pic_OrtaGri.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.pic_OrtaGri.Location = new System.Drawing.Point(0, 96);
            this.pic_OrtaGri.Name = "pic_OrtaGri";
            this.pic_OrtaGri.Size = new System.Drawing.Size(1024, 70);
            this.pic_OrtaGri.TabIndex = 39;
            this.pic_OrtaGri.TabStop = false;
            // 
            // pic_UstTaraf
            // 
            this.pic_UstTaraf.BackColor = System.Drawing.Color.DimGray;
            this.pic_UstTaraf.Location = new System.Drawing.Point(0, 12);
            this.pic_UstTaraf.Name = "pic_UstTaraf";
            this.pic_UstTaraf.Size = new System.Drawing.Size(1024, 50);
            this.pic_UstTaraf.TabIndex = 37;
            this.pic_UstTaraf.TabStop = false;
            // 
            // data_Reçete
            // 
            this.data_Reçete.AllowUserToAddRows = false;
            this.data_Reçete.AllowUserToDeleteRows = false;
            this.data_Reçete.AutoGenerateColumns = false;
            this.data_Reçete.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.DisplayedCells;
            this.data_Reçete.AutoSizeRowsMode = System.Windows.Forms.DataGridViewAutoSizeRowsMode.AllCells;
            this.data_Reçete.BackgroundColor = System.Drawing.Color.WhiteSmoke;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Century Gothic", 12F);
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.data_Reçete.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.data_Reçete.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.data_Reçete.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.reçeteNumarasıDataGridViewTextBoxColumn,
            this.tCKimlikNumarasıDataGridViewTextBoxColumn,
            this.ilaçAdıDataGridViewTextBoxColumn,
            this.ilaçKullanımŞekliDataGridViewTextBoxColumn,
            this.kulPeriyoduDataGridViewTextBoxColumn,
            this.perBirimiDataGridViewTextBoxColumn,
            this.kutuAdetiDataGridViewTextBoxColumn,
            this.pAdetDataGridViewTextBoxColumn,
            this.pDozDataGridViewTextBoxColumn});
            this.data_Reçete.DataSource = this.reçetelistBindingSource;
            dataGridViewCellStyle2.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle2.BackColor = System.Drawing.SystemColors.Window;
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Century Gothic", 12F);
            dataGridViewCellStyle2.ForeColor = System.Drawing.SystemColors.ControlText;
            dataGridViewCellStyle2.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle2.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle2.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.data_Reçete.DefaultCellStyle = dataGridViewCellStyle2;
            this.data_Reçete.GridColor = System.Drawing.Color.DarkGray;
            this.data_Reçete.Location = new System.Drawing.Point(12, 193);
            this.data_Reçete.Name = "data_Reçete";
            this.data_Reçete.ReadOnly = true;
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = System.Drawing.SystemColors.Control;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Century Gothic", 12F);
            dataGridViewCellStyle3.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle3.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle3.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.data_Reçete.RowHeadersDefaultCellStyle = dataGridViewCellStyle3;
            this.data_Reçete.RowHeadersVisible = false;
            dataGridViewCellStyle4.Font = new System.Drawing.Font("Century Gothic", 12F);
            this.data_Reçete.RowsDefaultCellStyle = dataGridViewCellStyle4;
            this.data_Reçete.Size = new System.Drawing.Size(1000, 307);
            this.data_Reçete.TabIndex = 45;
            // 
            // reçeteNumarasıDataGridViewTextBoxColumn
            // 
            this.reçeteNumarasıDataGridViewTextBoxColumn.DataPropertyName = "Reçete_Numarası";
            this.reçeteNumarasıDataGridViewTextBoxColumn.HeaderText = "Reçete Numarası";
            this.reçeteNumarasıDataGridViewTextBoxColumn.Name = "reçeteNumarasıDataGridViewTextBoxColumn";
            this.reçeteNumarasıDataGridViewTextBoxColumn.ReadOnly = true;
            this.reçeteNumarasıDataGridViewTextBoxColumn.Width = 154;
            // 
            // tCKimlikNumarasıDataGridViewTextBoxColumn
            // 
            this.tCKimlikNumarasıDataGridViewTextBoxColumn.DataPropertyName = "TC_Kimlik_Numarası";
            this.tCKimlikNumarasıDataGridViewTextBoxColumn.HeaderText = "TC Kimlik Numarası";
            this.tCKimlikNumarasıDataGridViewTextBoxColumn.Name = "tCKimlikNumarasıDataGridViewTextBoxColumn";
            this.tCKimlikNumarasıDataGridViewTextBoxColumn.ReadOnly = true;
            this.tCKimlikNumarasıDataGridViewTextBoxColumn.Width = 162;
            // 
            // ilaçAdıDataGridViewTextBoxColumn
            // 
            this.ilaçAdıDataGridViewTextBoxColumn.DataPropertyName = "İlaç_Adı";
            this.ilaçAdıDataGridViewTextBoxColumn.HeaderText = "İlaç Adı";
            this.ilaçAdıDataGridViewTextBoxColumn.Name = "ilaçAdıDataGridViewTextBoxColumn";
            this.ilaçAdıDataGridViewTextBoxColumn.ReadOnly = true;
            this.ilaçAdıDataGridViewTextBoxColumn.Width = 88;
            // 
            // ilaçKullanımŞekliDataGridViewTextBoxColumn
            // 
            this.ilaçKullanımŞekliDataGridViewTextBoxColumn.DataPropertyName = "İlaç_Kullanım_Şekli";
            this.ilaçKullanımŞekliDataGridViewTextBoxColumn.HeaderText = "İlaç Kullanım Şekli";
            this.ilaçKullanımŞekliDataGridViewTextBoxColumn.Name = "ilaçKullanımŞekliDataGridViewTextBoxColumn";
            this.ilaçKullanımŞekliDataGridViewTextBoxColumn.ReadOnly = true;
            this.ilaçKullanımŞekliDataGridViewTextBoxColumn.Width = 153;
            // 
            // kulPeriyoduDataGridViewTextBoxColumn
            // 
            this.kulPeriyoduDataGridViewTextBoxColumn.DataPropertyName = "Kul_Periyodu";
            this.kulPeriyoduDataGridViewTextBoxColumn.HeaderText = "Kul. Periyodu";
            this.kulPeriyoduDataGridViewTextBoxColumn.Name = "kulPeriyoduDataGridViewTextBoxColumn";
            this.kulPeriyoduDataGridViewTextBoxColumn.ReadOnly = true;
            this.kulPeriyoduDataGridViewTextBoxColumn.Width = 120;
            // 
            // perBirimiDataGridViewTextBoxColumn
            // 
            this.perBirimiDataGridViewTextBoxColumn.DataPropertyName = "Per_Birimi";
            this.perBirimiDataGridViewTextBoxColumn.HeaderText = "Per. Birimi";
            this.perBirimiDataGridViewTextBoxColumn.Name = "perBirimiDataGridViewTextBoxColumn";
            this.perBirimiDataGridViewTextBoxColumn.ReadOnly = true;
            this.perBirimiDataGridViewTextBoxColumn.Width = 97;
            // 
            // kutuAdetiDataGridViewTextBoxColumn
            // 
            this.kutuAdetiDataGridViewTextBoxColumn.DataPropertyName = "Kutu_Adeti";
            this.kutuAdetiDataGridViewTextBoxColumn.HeaderText = "Kutu Adeti";
            this.kutuAdetiDataGridViewTextBoxColumn.Name = "kutuAdetiDataGridViewTextBoxColumn";
            this.kutuAdetiDataGridViewTextBoxColumn.ReadOnly = true;
            this.kutuAdetiDataGridViewTextBoxColumn.Width = 109;
            // 
            // pAdetDataGridViewTextBoxColumn
            // 
            this.pAdetDataGridViewTextBoxColumn.DataPropertyName = "P_Adet";
            this.pAdetDataGridViewTextBoxColumn.HeaderText = "P. Adet";
            this.pAdetDataGridViewTextBoxColumn.Name = "pAdetDataGridViewTextBoxColumn";
            this.pAdetDataGridViewTextBoxColumn.ReadOnly = true;
            this.pAdetDataGridViewTextBoxColumn.Width = 86;
            // 
            // pDozDataGridViewTextBoxColumn
            // 
            this.pDozDataGridViewTextBoxColumn.DataPropertyName = "P_Doz";
            this.pDozDataGridViewTextBoxColumn.HeaderText = "P. Doz";
            this.pDozDataGridViewTextBoxColumn.Name = "pDozDataGridViewTextBoxColumn";
            this.pDozDataGridViewTextBoxColumn.ReadOnly = true;
            this.pDozDataGridViewTextBoxColumn.Width = 75;
            // 
            // reçetelistBindingSource
            // 
            this.reçetelistBindingSource.DataMember = "reçetelist";
            this.reçetelistBindingSource.DataSource = this.veritabanıReçete;
            // 
            // veritabanıReçete
            // 
            this.veritabanıReçete.DataSetName = "VeritabanıReçete";
            this.veritabanıReçete.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
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
            this.btn_İptal.Location = new System.Drawing.Point(472, 520);
            this.btn_İptal.Margin = new System.Windows.Forms.Padding(0);
            this.btn_İptal.Name = "btn_İptal";
            this.btn_İptal.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_İptal.Size = new System.Drawing.Size(85, 33);
            this.btn_İptal.TabIndex = 48;
            this.btn_İptal.Text = "İptal";
            this.btn_İptal.UseVisualStyleBackColor = false;
            this.btn_İptal.Click += new System.EventHandler(this.btn_İptal_Click);
            // 
            // reçetelistTableAdapter
            // 
            this.reçetelistTableAdapter.ClearBeforeFill = true;
            // 
            // btn_Arama
            // 
            this.btn_Arama.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.btn_Arama.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btn_Arama.FlatAppearance.BorderColor = System.Drawing.Color.Silver;
            this.btn_Arama.FlatAppearance.BorderSize = 0;
            this.btn_Arama.FlatAppearance.MouseDownBackColor = System.Drawing.Color.LightSkyBlue;
            this.btn_Arama.FlatAppearance.MouseOverBackColor = System.Drawing.Color.LightSkyBlue;
            this.btn_Arama.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_Arama.Font = new System.Drawing.Font("Century Gothic", 10F);
            this.btn_Arama.ForeColor = System.Drawing.Color.White;
            this.btn_Arama.Location = new System.Drawing.Point(501, 113);
            this.btn_Arama.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Arama.Name = "btn_Arama";
            this.btn_Arama.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.btn_Arama.Size = new System.Drawing.Size(85, 33);
            this.btn_Arama.TabIndex = 49;
            this.btn_Arama.Text = "Arama";
            this.btn_Arama.UseVisualStyleBackColor = false;
            this.btn_Arama.Click += new System.EventHandler(this.btn_Arama_Click);
            // 
            // txt_HastaKimlikNo
            // 
            this.txt_HastaKimlikNo.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_HastaKimlikNo.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_HastaKimlikNo.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_HastaKimlikNo.ForeColor = System.Drawing.Color.Black;
            this.txt_HastaKimlikNo.Location = new System.Drawing.Point(260, 116);
            this.txt_HastaKimlikNo.MaxLength = 20;
            this.txt_HastaKimlikNo.Name = "txt_HastaKimlikNo";
            this.txt_HastaKimlikNo.Size = new System.Drawing.Size(220, 30);
            this.txt_HastaKimlikNo.TabIndex = 1;
            // 
            // lbl_ReçeteNo
            // 
            this.lbl_ReçeteNo.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lbl_ReçeteNo.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.lbl_ReçeteNo.Font = new System.Drawing.Font("Century Gothic", 7F);
            this.lbl_ReçeteNo.ForeColor = System.Drawing.Color.White;
            this.lbl_ReçeteNo.Location = new System.Drawing.Point(705, 116);
            this.lbl_ReçeteNo.Name = "lbl_ReçeteNo";
            this.lbl_ReçeteNo.Size = new System.Drawing.Size(77, 32);
            this.lbl_ReçeteNo.TabIndex = 54;
            this.lbl_ReçeteNo.Text = "Reçete Numarası";
            this.lbl_ReçeteNo.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // txt_Reçeteid
            // 
            this.txt_Reçeteid.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.txt_Reçeteid.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txt_Reçeteid.Font = new System.Drawing.Font("Century Gothic", 14F);
            this.txt_Reçeteid.ForeColor = System.Drawing.Color.Black;
            this.txt_Reçeteid.Location = new System.Drawing.Point(788, 116);
            this.txt_Reçeteid.MaxLength = 20;
            this.txt_Reçeteid.Name = "txt_Reçeteid";
            this.txt_Reçeteid.Size = new System.Drawing.Size(105, 30);
            this.txt_Reçeteid.TabIndex = 2;
            // 
            // btn_Sil
            // 
            this.btn_Sil.BackColor = System.Drawing.SystemColors.WindowFrame;
            this.btn_Sil.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.btn_Sil.FlatAppearance.BorderColor = System.Drawing.Color.DodgerBlue;
            this.btn_Sil.FlatAppearance.BorderSize = 0;
            this.btn_Sil.FlatAppearance.MouseDownBackColor = System.Drawing.Color.IndianRed;
            this.btn_Sil.FlatAppearance.MouseOverBackColor = System.Drawing.Color.IndianRed;
            this.btn_Sil.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btn_Sil.Font = new System.Drawing.Font("Century Gothic", 12F);
            this.btn_Sil.ForeColor = System.Drawing.Color.White;
            this.btn_Sil.Location = new System.Drawing.Point(899, 116);
            this.btn_Sil.Margin = new System.Windows.Forms.Padding(0);
            this.btn_Sil.Name = "btn_Sil";
            this.btn_Sil.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.btn_Sil.Size = new System.Drawing.Size(35, 30);
            this.btn_Sil.TabIndex = 52;
            this.btn_Sil.Text = "Sil";
            this.btn_Sil.UseVisualStyleBackColor = false;
            this.btn_Sil.Click += new System.EventHandler(this.btn_Sil_Click);
            // 
            // frm_ReçeteGörüntüle
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1024, 577);
            this.ControlBox = false;
            this.Controls.Add(this.lbl_ReçeteNo);
            this.Controls.Add(this.txt_Reçeteid);
            this.Controls.Add(this.btn_Sil);
            this.Controls.Add(this.txt_HastaKimlikNo);
            this.Controls.Add(this.btn_Arama);
            this.Controls.Add(this.btn_İptal);
            this.Controls.Add(this.data_Reçete);
            this.Controls.Add(this.lbl_TcKimlik);
            this.Controls.Add(this.pic_OrtaGri);
            this.Controls.Add(this.lbl_Baslik);
            this.Controls.Add(this.pic_UstTaraf);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frm_ReçeteGörüntüle";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "EkranReçeteGörüntüleme";
            this.Load += new System.EventHandler(this.frm_ReçeteGörüntüle_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pic_OrtaGri)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pic_UstTaraf)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.data_Reçete)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.reçetelistBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.veritabanıReçete)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Label lbl_TcKimlik;
        private System.Windows.Forms.PictureBox pic_OrtaGri;
        private System.Windows.Forms.Label lbl_Baslik;
        private System.Windows.Forms.PictureBox pic_UstTaraf;
        private System.Windows.Forms.DataGridView data_Reçete;
        private System.Windows.Forms.Button btn_İptal;
        private VeritabanıReçete veritabanıReçete;
        private System.Windows.Forms.BindingSource reçetelistBindingSource;
        private VeritabanıReçeteTableAdapters.reçetelistTableAdapter reçetelistTableAdapter;
        private System.Windows.Forms.DataGridViewTextBoxColumn reçeteNumarasıDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn tCKimlikNumarasıDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn ilaçAdıDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn ilaçKullanımŞekliDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn kulPeriyoduDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn perBirimiDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn kutuAdetiDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn pAdetDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn pDozDataGridViewTextBoxColumn;
        private System.Windows.Forms.Button btn_Arama;
        private System.Windows.Forms.TextBox txt_HastaKimlikNo;
        private System.Windows.Forms.Label lbl_ReçeteNo;
        private System.Windows.Forms.TextBox txt_Reçeteid;
        private System.Windows.Forms.Button btn_Sil;
    }
}