<?php
class Listing extends CI_Controller {

        public function index() {
			$this->output->set_content_type('application/json');
	 
			switch (strtoupper($this->input->method())) {
				case "POST":
					$this->output->set_output(json_encode(array('foo' => $this->input->method())));
					break;
				case "GET":
					$streetNum = $this->input->get('streetNum');
					$streetName = $this->input->get('streetName');
					$city = $this->input->get('city');
					$state = $this->input->get('state');
					$id = $this->input->get('id');
					$url = "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz1dvqqhbgz63_aovt1&address=".str_replace(" ","+",$streetNum)."+".str_replace(" ","+",$streetName)."&citystatezip=".str_replace(" ","+",$city)."%2c+".str_replace(" ","+",$state);
					$ch = curl_init($url);
					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$curl_scraped_page = curl_exec($ch);
					$xml = simplexml_load_string($curl_scraped_page);
					$prop = $xml->response->results->result;
					$url = "http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=X1-ZWz1dvqqhbgz63_aovt1&zpid=".$prop->zpid;
					$ch = curl_init($url);
					curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
					$curl_scraped_page = curl_exec($ch);
					$xml = simplexml_load_string($curl_scraped_page);
					$this->output->set_output(json_encode(array('property' => $prop, 'details' => $xml)));
					break;
				default:
					$this->output->set_status_header(404);
					break;
			}
   
 		}
}

?>