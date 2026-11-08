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
    public partial class frmHastaGuncellemeEkranı : Form
    {
        public frmHastaGuncellemeEkranı()
        {
            InitializeComponent();
        }

        string patientid = " ";

        private void frmHastaGuncellemeEkranı_Load(object sender, EventArgs e)
        {
            this.doctorlistTableAdapter.Fill(this.hekimList.doctorlist);
            txt_TcKimlikNo.Text = frm_EkranMenu.SelectedRow.Cells[1].Value.ToString();
            txt_Ad.Text = frm_EkranMenu.SelectedRow.Cells[2].Value.ToString();
            txt_Soyad.Text = frm_EkranMenu.SelectedRow.Cells[3].Value.ToString();
            txt_BabaAdı.Text = frm_EkranMenu.SelectedRow.Cells[4].Value.ToString();
            cmb_DogumYeri.Text = frm_EkranMenu.SelectedRow.Cells[5].Value.ToString();
            dt_DogumTarihi.Text = frm_EkranMenu.SelectedRow.Cells[6].Value.ToString();
            cmb_Cinsiyet.Text = frm_EkranMenu.SelectedRow.Cells[7].Value.ToString();
            cmb_KanGrubu.Text = frm_EkranMenu.SelectedRow.Cells[8].Value.ToString();
            cmb_GuvenlikKurumu.Text = frm_EkranMenu.SelectedRow.Cells[9].Value.ToString();
            txt_Ates.Text = frm_EkranMenu.SelectedRow.Cells[10].Value.ToString();
            txt_Tansiyon.Text = frm_EkranMenu.SelectedRow.Cells[11].Value.ToString();
            txt_Nabız.Text = frm_EkranMenu.SelectedRow.Cells[12].Value.ToString();
            txt_Kilo.Text = frm_EkranMenu.SelectedRow.Cells[13].Value.ToString();
            txt_Boy.Text = frm_EkranMenu.SelectedRow.Cells[14].Value.ToString();
            txt_OzGecmis.Text = frm_EkranMenu.SelectedRow.Cells[15].Value.ToString();
            txt_SoyGecmis.Text = frm_EkranMenu.SelectedRow.Cells[16].Value.ToString();
            txt_Sikayet.Text = frm_EkranMenu.SelectedRow.Cells[17].Value.ToString();
            txt_Hikaye.Text = frm_EkranMenu.SelectedRow.Cells[18].Value.ToString();
            txt_FizikiBulgu.Text = frm_EkranMenu.SelectedRow.Cells[19].Value.ToString();
            txt_LabBulgusu.Text = frm_EkranMenu.SelectedRow.Cells[20].Value.ToString();
            txt_Tedavi.Text = frm_EkranMenu.SelectedRow.Cells[21].Value.ToString();
            txt_Karar.Text = frm_EkranMenu.SelectedRow.Cells[22].Value.ToString();
            cmb_TriajRenk.Text = frm_EkranMenu.SelectedRow.Cells[23].Value.ToString();
            cmb_KabulSekli.Text = frm_EkranMenu.SelectedRow.Cells[24].Value.ToString();
            cmb_CikisSekli.Text = frm_EkranMenu.SelectedRow.Cells[25].Value.ToString();
            txt_Acıklama.Text = frm_EkranMenu.SelectedRow.Cells[26].Value.ToString();
            cmb_Hekim.Text = frm_EkranMenu.SelectedRow.Cells[27].Value.ToString();
            dt_MuaneyeGirisTarih.Text = frm_EkranMenu.SelectedRow.Cells[28].Value.ToString();
            dt_MuanedenCıkısTarihi.Text = frm_EkranMenu.SelectedRow.Cells[29].Value.ToString();
            txt_Tanı.Text = frm_EkranMenu.SelectedRow.Cells[30].Value.ToString();

        }

        private void btn_Guncelle_Click(object sender, EventArgs e)
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
                xp.Parameters.AddWithValue("@Güvenlik_Kurumu", cmb_GuvenlikKurumu.Text);
                xp.Parameters.AddWithValue("@Ateş", txt_Ates.Text);
                xp.Parameters.AddWithValue("@Tansiyon", txt_Tansiyon.Text);
                xp.Parameters.AddWithValue("@Nabız", txt_Nabız.Text);
                xp.Parameters.AddWithValue("@Kilo", txt_Kilo.Text);
                xp.Parameters.AddWithValue("@Boy", txt_Boy.Text);
                xp.Parameters.AddWithValue("@Öz_Geçmiş", txt_OzGecmis.Text);
                xp.Parameters.AddWithValue("@Soy_Geçmiş", txt_SoyGecmis.Text);
                xp.Parameters.AddWithValue("@Şikayet", txt_Sikayet.Text);
                xp.Parameters.AddWithValue("@Hikayesi", txt_Hikaye.Text);
                xp.Parameters.AddWithValue("@Fiziki_Bulgu", txt_FizikiBulgu.Text);
                xp.Parameters.AddWithValue("@Laboratuvar_Bulgusu", txt_LabBulgusu.Text);
                xp.Parameters.AddWithValue("@Tedavi", txt_Tedavi.Text);
                xp.Parameters.AddWithValue("@Karar", txt_Karar.Text);
                xp.Parameters.AddWithValue("@Triaj_Rengi", cmb_TriajRenk.Text);
                xp.Parameters.AddWithValue("@Kabul_Şekli", cmb_KabulSekli.Text);
                xp.Parameters.AddWithValue("@Çıkış_Şekli", cmb_CikisSekli.Text);
                xp.Parameters.AddWithValue("@Açıklama", txt_Acıklama.Text);
                xp.Parameters.AddWithValue("@Hekim", cmb_Hekim.Text);
                xp.Parameters.AddWithValue("@Muayene_Giriş_Tarihi", dt_MuaneyeGirisTarih.Text);
                xp.Parameters.AddWithValue("@Muayene_Bitiş_Tarihi", dt_MuanedenCıkısTarihi.Text);
                xp.Parameters.AddWithValue("@Tanı", txt_Tanı.Text);

                sql.Open();
                xp.ExecuteNonQuery();
                sql.Close();

                patientid = frm_EkranMenu.SelectedRow.Cells[0].Value.ToString();
                SqlCommand dl = new SqlCommand("DELETE FROM patientlist WHERE Hasta_Kayıt_Numarası = @Hasta_Kayıt_Numarası", sql);
                dl.Parameters.AddWithValue("@Hasta_Kayıt_Numarası", patientid);
                sql.Open();
                dl.ExecuteNonQuery();
                sql.Close();

                this.Close();
                MessageBox.Show("Güncelleme Başarılı, Lütfen Hasta Sorgulama sayfasını yenileyiniz");
            }
        }

        private void btn_İptal_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
