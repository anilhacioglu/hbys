using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace Hastane_Bilgi_Yönetim_Sistemi
{
    public partial class frm_YeniReçeteEkranı : Form
    {
        public frm_YeniReçeteEkranı()
        {
            InitializeComponent();
        }

        private void frm_YeniReçeteEkranı_Load(object sender, EventArgs e)
        {
            this.patientlistTableAdapter.Fill(this.veritabanıHasta.patientlist);
        }

        private void list_İlacAd_SelectedIndexChanged(object sender, EventArgs e)
        {
            txt_İlacAd.Text = list_İlacAd.Text;
        }

        private void list_İlacKullanımSekli_SelectedIndexChanged(object sender, EventArgs e)
        {
            txt_KullanımSekli.Text = list_İlacKullanımSekli.Text;
        }

        private void list_KullanımPeriyodu_SelectedIndexChanged(object sender, EventArgs e)
        {
            txt_KullanımPeriyodu.Text = list_KullanımPeriyodu.Text;
        }

        private void list_PerBirimi_SelectedIndexChanged(object sender, EventArgs e)
        {
            txt_PerBirimi.Text = list_PerBirimi.Text;
        }

        private void list_KutuAdet_SelectedIndexChanged(object sender, EventArgs e)
        {
            txt_KutuAdeti.Text = list_KutuAdet.Text;
        }

        private void list_PerAdet_SelectedIndexChanged(object sender, EventArgs e)
        {
            txt_PerAdet.Text = list_PerAdet.Text;
        }

        private void list_PerDoz_SelectedIndexChanged(object sender, EventArgs e)
        {
            txt_PerDoz.Text = list_PerDoz.Text;
        }

        private void btn_İptal_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btn_Kaydet_Click(object sender, EventArgs e)
        {
            SqlConnection sql = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            {
                SqlCommand xp = new SqlCommand("insert into reçetelist (TC_Kimlik_Numarası, İlaç_Adı, İlaç_Kullanım_Şekli, Kul_Periyodu, Per_Birimi, Kutu_Adeti, P_Adet, P_Doz) values (@TC_Kimlik_Numarası, @İlaç_Adı, @İlaç_Kullanım_Şekli, @Kul_Periyodu, @Per_Birimi, @Kutu_Adeti, @P_Adet, @P_Doz)", sql);
                xp.Parameters.AddWithValue("@TC_Kimlik_Numarası", cmb_HastaTcKimlikNo.Text);
                xp.Parameters.AddWithValue("@İlaç_Adı", txt_İlacAd.Text);
                xp.Parameters.AddWithValue("@İlaç_Kullanım_Şekli", txt_KullanımSekli.Text);
                xp.Parameters.AddWithValue("@Kul_Periyodu", txt_KullanımPeriyodu.Text);
                xp.Parameters.AddWithValue("@Per_Birimi", txt_PerBirimi.Text);
                xp.Parameters.AddWithValue("@Kutu_Adeti", txt_KutuAdeti.Text);
                xp.Parameters.AddWithValue("@P_Adet", txt_PerAdet.Text);
                xp.Parameters.AddWithValue("@P_Doz", txt_PerDoz.Text);
                sql.Open();
                xp.ExecuteNonQuery();
                sql.Close();

                MessageBox.Show("Ekleme Başarılı");
            }
        }
    }
}
