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
    public partial class frm_HastaKayıtEkranı : Form
    {
        public frm_HastaKayıtEkranı()
        {
            InitializeComponent();
        }

        private void frm_HastaKayıtEkranı_Load(object sender, EventArgs e)
        {
            this.doctorlistTableAdapter1.Fill(this.hekimList.doctorlist);
        }

        private void btn_Kaydet_Click(object sender, EventArgs e)
        {
            SqlConnection sql = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            {
                SqlCommand xp = new SqlCommand("insert into patientlist (TC_Kimlik_Numarası, Ad, Soyad, Baba_adı, Doğum_Yeri, Doğum_Tarihi, Cinsiyet, Kan_Grubu, Güvenlik_Kurumu, Ateş, Tansiyon, Nabız, Kilo, Boy, Öz_Geçmiş, Soy_Geçmiş, Şikayet, Hikayesi, Fiziki_Bulgu, Laboratuvar_Bulgusu, Tedavi, Karar, Triaj_Rengi, Kabul_Şekli, Çıkış_Şekli, Açıklama, Hekim, Muayene_Giriş_Tarihi, Muayene_Bitiş_Tarihi, Tanı) values (@TC_Kimlik_Numarası, @Ad, @Soyad, @Baba_adı, @Doğum_Yeri, @Doğum_Tarihi, @Cinsiyet, @Kan_Grubu, @Güvenlik_Kurumu, @Ateş, @Tansiyon, @Nabız, @Kilo, @Boy, @Öz_Geçmiş, @Soy_Geçmiş, @Şikayet, @Hikayesi, @Fiziki_Bulgu, @Laboratuvar_Bulgusu, @Tedavi, @Karar, @Triaj_Rengi, @Kabul_Şekli, @Çıkış_Şekli, @Açıklama, @Hekim, @Muayene_Giriş_Tarihi, @Muayene_Bitiş_Tarihi, @Tanı)", sql);
                xp.Parameters.AddWithValue("@TC_Kimlik_Numarası", txt_TcKimlikNo.Text);
                xp.Parameters.AddWithValue("@Ad", txt_Ad.Text);
                xp.Parameters.AddWithValue("@Soyad", txt_Soyad.Text);
                xp.Parameters.AddWithValue("@Baba_adı", txt_BabaAdı.Text);
                xp.Parameters.AddWithValue("@Doğum_Yeri", cmb_DogumYeri.Text);
                xp.Parameters.AddWithValue("@Doğum_Tarihi", dt_DogumTarihi.Text);
                xp.Parameters.AddWithValue("@Cinsiyet", cmb_Cinsiyet.Text);
                xp.Parameters.AddWithValue("@Kan_Grubu", cmb_KanGrubu.Text);
                xp.Parameters.AddWithValue("@Güvenlik_Kurumu", cmb_GüvenlikKurumu.Text);
                xp.Parameters.AddWithValue("@Ateş", txt_Ates.Text);
                xp.Parameters.AddWithValue("@Tansiyon", txt_Tansiyon.Text);
                xp.Parameters.AddWithValue("@Nabız", txt_Nabız.Text);
                xp.Parameters.AddWithValue("@Kilo", txt_Kilo.Text);
                xp.Parameters.AddWithValue("@Boy", txt_boy.Text);
                xp.Parameters.AddWithValue("@Öz_Geçmiş", txt_OzGecmis.Text);
                xp.Parameters.AddWithValue("@Soy_Geçmiş", txt_SoyGecmis.Text);
                xp.Parameters.AddWithValue("@Şikayet", txt_Sikayet.Text);
                xp.Parameters.AddWithValue("@Hikayesi", txt_Hikaye.Text);
                xp.Parameters.AddWithValue("@Fiziki_Bulgu", txt_FizikiBulgu.Text);
                xp.Parameters.AddWithValue("@Laboratuvar_Bulgusu", txt_LabBulgusu.Text);
                xp.Parameters.AddWithValue("@Tedavi", txt_Tedavi.Text);
                xp.Parameters.AddWithValue("@Karar", txt_Karar.Text);
                xp.Parameters.AddWithValue("@Triaj_Rengi", cmb_TriajRengi.Text);
                xp.Parameters.AddWithValue("@Kabul_Şekli", cmb_KabulSekli.Text);
                xp.Parameters.AddWithValue("@Çıkış_Şekli", cmb_CikisSekli.Text);
                xp.Parameters.AddWithValue("@Açıklama", txt_Acıklama.Text);
                xp.Parameters.AddWithValue("@Hekim", cmb_Hekim.Text);
                xp.Parameters.AddWithValue("@Muayene_Giriş_Tarihi", dt_MuaneyeGirisTarihi.Text);
                xp.Parameters.AddWithValue("@Muayene_Bitiş_Tarihi", dt_MuaneCikisTarihi.Text);
                xp.Parameters.AddWithValue("@Tanı", txt_Tanı.Text);

                sql.Open();
                xp.ExecuteNonQuery();
                sql.Close();

                this.Close();
                MessageBox.Show("Ekleme Başarılı, Lütfen Hasta Sorgulama sayfasını yenileyiniz");
            }
        }

        private void btn_İptal_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
