using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Windows.Forms;

namespace CARStoons
{
    public partial class FormInsertar : Form
    {
        private DataTable _tablaEstructura;
        private Dictionary<string, TextBox> _cajasDeTexto = new Dictionary<string, TextBox>();

        public FormInsertar(string nombreTabla, DataTable estructura)
        {
            
            this.Text = "Insertar nuevo registro en: " + nombreTabla;
            this.StartPosition = FormStartPosition.CenterParent;
            this.AutoScroll = true; 

            _tablaEstructura = estructura;
            GenerarCamposDinamicos();
        }

        private void GenerarCamposDinamicos()
        {
            int posicionY = 20;

            foreach (DataColumn columna in _tablaEstructura.Columns)
            {

                string nombreCol = columna.ColumnName.ToLower();

                if (columna.AutoIncrement ||
                    nombreCol.StartsWith("id_") ||
                    nombreCol == "fecha_registro" ||
                    nombreCol == "fecha_creacion" ||
                    nombreCol == "fecha_pago" ||
                    nombreCol == "fecha_resena" ||
                    nombreCol == "activo" ||
                    nombreCol == "disponible")
                {
                    continue; 
                }

               
                Label lbl = new Label();
                lbl.Text = columna.ColumnName.ToUpper() + ":";
                lbl.Location = new Point(20, posicionY);
                lbl.AutoSize = true;
                lbl.Font = new Font("Segoe UI", 9, FontStyle.Bold);
                this.Controls.Add(lbl);

                
                TextBox txt = new TextBox();
                txt.Name = columna.ColumnName;
                txt.Location = new Point(180, posicionY);
                txt.Width = 250;

                _cajasDeTexto.Add(columna.ColumnName, txt);
                this.Controls.Add(txt);

                posicionY += 40; 
            }

            
            Button btnGuardar = new Button();
            btnGuardar.Text = "Confirmar y Guardar";
            btnGuardar.Location = new Point(180, posicionY + 10);
            btnGuardar.Size = new Size(250, 40);
            btnGuardar.BackColor = Color.LightGreen;
            btnGuardar.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            btnGuardar.Click += BtnGuardar_Click;

            this.Controls.Add(btnGuardar);

            
            this.Height = posicionY + 120;
            this.Width = 500;
        }

        private void BtnGuardar_Click(object sender, EventArgs e)
        {
            try
            {
                
                DataRow nuevaFila = _tablaEstructura.NewRow();

                
                foreach (var input in _cajasDeTexto)
                {
                    if (!string.IsNullOrWhiteSpace(input.Value.Text))
                    {
                        nuevaFila[input.Key] = input.Value.Text;
                    }
                }

               
                _tablaEstructura.Rows.Add(nuevaFila);
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Asegúrate de escribir los datos en el formato correcto (ej. números en campos de precio).\nError: " + ex.Message, "Error de validación");
            }
        }
    }
}

