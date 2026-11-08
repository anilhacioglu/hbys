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
    public partial class frm_ReçeteGörüntüle : Form
    {
        public frm_ReçeteGörüntüle()
        {
            InitializeComponent();
        }

        private void frm_ReçeteGörüntüle_Load(object sender, EventArgs e)
        {
            this.reçetelistTableAdapter.Fill(this.veritabanıReçete.reçetelist);
        }

        private void btn_İptal_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btn_Arama_Click(object sender, EventArgs e)
        {
            string searchValue = txt_HastaKimlikNo.Text;
            try
            {
                SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
                con.Open();
                string query = "Select * from reçetelist";
                SqlDataAdapter sda = new SqlDataAdapter(query, con);
                DataTable dtbl = new DataTable();
                sda.Fill(dtbl);
                data_Reçete.DataSource = dtbl;

                var re = from row in dtbl.AsEnumerable()
                         where row[1].ToString().Contains(searchValue)
                         select row;
                if (re.Count() == 0)
                {
                    MessageBox.Show("Bulunamadı");
                }
                else
                {
                    data_Reçete.DataSource = re.CopyToDataTable();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }

        private void btn_Sil_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            SqlCommand xp = new SqlCommand("DELETE FROM reçetelist WHERE Reçete_Numarası = @Reçete_Numarası", con);
            xp.Parameters.AddWithValue("@Reçete_Numarası", txt_Reçeteid.Text);
            con.Open();
            xp.ExecuteNonQuery();
            con.Close();

            string query = "Select * from reçetelist";
            SqlDataAdapter sda = new SqlDataAdapter(query, con);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            data_Reçete.DataSource = dtbl;
        }
    }
}
