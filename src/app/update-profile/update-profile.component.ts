import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';



@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, UploadModalComponent],  // Removed HttpClientModule from imports
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent implements OnInit {
  profileForm: FormGroup;

  genderOptions = ['Male', 'Female', 'Non-binary', 'Other'];
  orientationOptions = ['Straight', 'Gay', 'Bisexual', 'Asexual', 'Other'];
  lookingForOptions = ['Friends', 'Networking', 'Dates','Relationship', 'Other'];
  
  professionInput: string = '';
  filteredProfessions: string[] = [];
  
  
  professionOptions: string[] = ['AI Data Scientist', 'AWS Architect', 'Account Executive', 'Account Executive (Mid-market)', 'Account Manager (AM)', 'Agile project manager', 'Animation expert', 'Application Analyst', 'Application Developer', 'Applications Architect', 'Artificial Intelligence/Machine Learning (AI/ML) developer', 'Artificial intelligence engineer', 'Artificial intelligence specialist', 'Associate Creative Director, Creative Technology', 'Automotive technology leadership & program manager', 'Azure Architect', 'Azure Cloud Engineer', 'Azure Developer', 'Azure Engineer', 'Backend (Server Side) Developer', 'Backend (Server-Side) Developer', 'Big Data Developer', 'Big Data Engineer', 'Blockchain engineer', 'Brand manager', 'Business Development Manager (BDM)', 'Business Development Representative (BDR)', 'Business Intelligence Analyst', 'Business Intelligence Developer', 'C developers', 'Chief AI officer', 'Chief Data Officer', 'Chief Data Officers', 'Chief Information Officer (CIO)', 'Chief Information Security Officer', 'Chief Product Officer', 'Chief Technology Officer (CTO)', 'Cloud Developers', 'Cloud Engineer', 'Cloud Infrastructure Engineer', 'Cloud Project Manager', 'Cloud architect', 'Computer hardware engineer', 'Computer network architect', 'Computer programmer', 'Content Marketing Manager', 'Copywriter', 'Country Manager (CM)', 'Creative Director', 'Customer Success Manager (CSM)', 'Customization Developers', 'Cyber Security Engineer', 'Cybersecurity specialist', 'Data Privacy Officer', 'Data Product Manager', 'Data Science Developer', 'Data Security Analyst', 'Data Translator', 'Data Warehouse Architect', 'Data analyst', 'Data architect', 'Data modeler', 'Data scientist', 'Database Manager', 'Database administrator', 'Deep Learning Engineer', 'Deputy Chief Information Officers', 'Designer: Creative Department', 'Desktop Developers', 'DevOps Engineer', 'DevOps manager', 'Development Operations Manager', 'Digital Marketing Manager', 'Digital designer', 'Digital marketer', 'Digital producer', 'Direct Sales', 'Director of IT Infrastructure', 'Directors of IT Infrastructure and Operations', 'Directors of IT Operations', 'Directors of IT Security', 'Directors of Information Technology', 'Directors of Infrastructure', 'Directors of Network Development', 'Directors of Technology', 'Directors of Technology Solutions', 'Embedded Developers', 'Engineering Support', 'Enterprise Account Executive', 'Enterprise Architect', 'Front-End Developer', 'Full-stack developer', 'Game Designer/Coder', 'General Manager (High Tech Sales Company)', 'Graphic Developers', 'Graphic designer', 'Head of Workplace Technology', 'IT Associate Director', 'IT Management', 'IT Security Specialist', 'IT Systems Security Manager', 'IT infrastructure project manager', 'ITSM Managers', 'Information Systems Security Manager', 'Information Technology Manager', 'Infrastructure Managers', 'Infrastructure analyst', 'Infrastructure software manager', 'Inside Sales Representative', 'Interaction designer', 'Internet of Things (IoT) Engineer', 'Internet of Things (IoT) Solutions Architect', 'Linux Engineer', 'Linux Systems Administrator', 'ML Ops Engineer', 'Machine Learning Engineer', 'Market analyst', 'Marketing Manager - Technology Sector', 'Marketing Specialist', 'Middle Tier Developer', 'Mobile Applications Developer', 'Mobile app developer', 'Mobile application developer', 'Network Security Engineer', 'Network and Computer Systems Administrator', 'Network engineer', 'Network/systems administrator', 'Operating systems developer', 'Other', 'Partner Sales', 'Performance Marketer', 'Platform Engineer', 'Product Manager', 'Prompt Engineer', 'Python developer', 'Renewal Specialist', 'Robotics Engineer', 'Ruby on Rails developer', 'SCCM Engineer', 'Sales Development Representative', 'Sales Director', 'Sales Manager (SM)', 'Sales and Marketing Executive – IT Industry', 'Sales engineer', 'Security Developer', 'Security management specialist', 'Senior Cloud Engineer', 'Senior Infrastructure Engineer', 'Senior Systems Engineer', 'Service desk/help desk/support agent specialist', 'Site Reliability Engineer', 'Social media Manager', 'Software Architect', 'Software Development Engineer in Test (SDET)', 'Software Integration Engineer', 'Software Test Engineer', 'Software engineer', 'Solutions Engineer', 'Special Effects Artists', 'Strategic Alliance Manager', 'Strategic Partnership Manager', 'Student', 'Systems Analyst', 'Systems Engineer', 'Systems analyst', 'Systems operator', 'Technical Designer', 'Technical Sales Representative', 'Technical Support Engineer', 'Technical lead', 'Technical support specialist', 'UI/UX Designer', 'User Experience Designer', 'User Interface (UI) Engineer', 'User Interface Designer', 'VP of Marketing', 'VP of Sales', 'Vice President of Software Engineering', 'Vice President, Technology Financial Management Leader', 'Video game developer', 'Web Application Security Engineers (WASE)', 'Web developer', 'Windows Support Engineer', 'Wintel Engineer']
;
  locationOptions: string[] = ["New York, New York", "Los Angeles, California", "Chicago, Illinois", "Houston, Texas", "Philadelphia, Pennsylvania", "Phoenix, Arizona", "San Antonio, Texas", "San Diego, California", "Dallas, Texas", "San Jose, California", "Austin, Texas", "Indianapolis, Indiana", "Jacksonville, Florida", "San Francisco, California", "Columbus, Ohio", "Charlotte, North Carolina", "Fort Worth, Texas", "Detroit, Michigan", "El Paso, Texas", "Memphis, Tennessee", "Seattle, Washington", "Denver, Colorado", "Washington, District of Columbia", "Boston, Massachusetts", "Nashville-Davidson, Tennessee", "Baltimore, Maryland", "Oklahoma City, Oklahoma", "Louisville/Jefferson County, Kentucky", "Portland, Oregon", "Las Vegas, Nevada", "Milwaukee, Wisconsin", "Albuquerque, New Mexico", "Tucson, Arizona", "Fresno, California", "Sacramento, California", "Long Beach, California", "Kansas City, Missouri", "Mesa, Arizona", "Virginia Beach, Virginia", "Atlanta, Georgia", "Colorado Springs, Colorado", "Omaha, Nebraska", "Raleigh, North Carolina", "Miami, Florida", "Oakland, California", "Minneapolis, Minnesota", "Tulsa, Oklahoma", "Cleveland, Ohio", "Wichita, Kansas", "Arlington, Texas", "New Orleans, Louisiana", "Bakersfield, California", "Tampa, Florida", "Honolulu, Hawaii", "Aurora, Colorado", "Anaheim, California", "Santa Ana, California", "St. Louis, Missouri", "Riverside, California", "Corpus Christi, Texas", "Lexington-Fayette, Kentucky", "Pittsburgh, Pennsylvania", "Anchorage, Alaska", "Stockton, California", "Cincinnati, Ohio", "St. Paul, Minnesota", "Toledo, Ohio", "Greensboro, North Carolina", "Newark, New Jersey", "Plano, Texas", "Henderson, Nevada", "Lincoln, Nebraska", "Buffalo, New York", "Jersey City, New Jersey", "Chula Vista, California", "Fort Wayne, Indiana", "Orlando, Florida", "St. Petersburg, Florida", "Chandler, Arizona", "Laredo, Texas", "Norfolk, Virginia", "Durham, North Carolina", "Madison, Wisconsin", "Lubbock, Texas", "Irvine, California", "Winston-Salem, North Carolina", "Glendale, Arizona", "Garland, Texas", "Hialeah, Florida", "Reno, Nevada", "Chesapeake, Virginia", "Gilbert, Arizona", "Baton Rouge, Louisiana", "Irving, Texas", "Scottsdale, Arizona", "North Las Vegas, Nevada", "Fremont, California", "Boise City, Idaho", "Richmond, Virginia", "San Bernardino, California", "Birmingham, Alabama", "Spokane, Washington", "Rochester, New York", "Des Moines, Iowa", "Modesto, California", "Fayetteville, North Carolina", "Tacoma, Washington", "Oxnard, California", "Fontana, California", "Columbus, Georgia", "Montgomery, Alabama", "Moreno Valley, California", "Shreveport, Louisiana", "Aurora, Illinois", "Yonkers, New York", "Akron, Ohio", "Huntington Beach, California", "Little Rock, Arkansas", "Augusta-Richmond County, Georgia", "Amarillo, Texas", "Glendale, California", "Mobile, Alabama", "Grand Rapids, Michigan", "Salt Lake City, Utah", "Tallahassee, Florida", "Huntsville, Alabama", "Grand Prairie, Texas", "Knoxville, Tennessee", "Worcester, Massachusetts", "Newport News, Virginia", "Brownsville, Texas", "Overland Park, Kansas", "Santa Clarita, California", "Providence, Rhode Island", "Garden Grove, California", "Chattanooga, Tennessee", "Oceanside, California", "Jackson, Mississippi", "Fort Lauderdale, Florida", "Santa Rosa, California", "Rancho Cucamonga, California", "Port St. Lucie, Florida", "Tempe, Arizona", "Ontario, California", "Vancouver, Washington", "Cape Coral, Florida", "Sioux Falls, South Dakota", "Springfield, Missouri", "Peoria, Arizona", "Pembroke Pines, Florida", "Elk Grove, California", "Salem, Oregon", "Lancaster, California", "Corona, California", "Eugene, Oregon", "Palmdale, California", "Salinas, California", "Springfield, Massachusetts", "Pasadena, Texas", "Fort Collins, Colorado", "Hayward, California", "Pomona, California", "Cary, North Carolina", "Rockford, Illinois", "Alexandria, Virginia", "Escondido, California", "McKinney, Texas", "Kansas City, Kansas", "Joliet, Illinois", "Sunnyvale, California", "Torrance, California", "Bridgeport, Connecticut", "Lakewood, Colorado", "Hollywood, Florida", "Paterson, New Jersey", "Naperville, Illinois", "Syracuse, New York", "Mesquite, Texas", "Dayton, Ohio", "Savannah, Georgia", "Clarksville, Tennessee", "Orange, California", "Pasadena, California", "Fullerton, California", "Killeen, Texas", "Frisco, Texas", "Hampton, Virginia", "McAllen, Texas", "Warren, Michigan", "Bellevue, Washington", "West Valley City, Utah", "Columbia, South Carolina", "Olathe, Kansas", "Sterling Heights, Michigan", "New Haven, Connecticut", "Miramar, Florida", "Waco, Texas", "Thousand Oaks, California", "Cedar Rapids, Iowa", "Charleston, South Carolina", "Visalia, California", "Topeka, Kansas", "Elizabeth, New Jersey", "Gainesville, Florida", "Thornton, Colorado", "Roseville, California", "Carrollton, Texas", "Coral Springs, Florida", "Stamford, Connecticut", "Simi Valley, California", "Concord, California", "Hartford, Connecticut", "Kent, Washington", "Lafayette, Louisiana", "Midland, Texas", "Surprise, Arizona", "Denton, Texas", "Victorville, California", "Evansville, Indiana", "Santa Clara, California", "Abilene, Texas", "Athens-Clarke County, Georgia", "Vallejo, California", "Allentown, Pennsylvania", "Norman, Oklahoma", "Beaumont, Texas", "Independence, Missouri", "Murfreesboro, Tennessee", "Ann Arbor, Michigan", "Springfield, Illinois", "Berkeley, California", "Peoria, Illinois", "Provo, Utah", "El Monte, California", "Columbia, Missouri", "Lansing, Michigan", "Fargo, North Dakota", "Downey, California", "Costa Mesa, California", "Wilmington, North Carolina", "Arvada, Colorado", "Inglewood, California", "Miami Gardens, Florida", "Carlsbad, California", "Westminster, Colorado", "Rochester, Minnesota", "Odessa, Texas", "Manchester, New Hampshire", "Elgin, Illinois", "West Jordan, Utah", "Round Rock, Texas", "Clearwater, Florida", "Waterbury, Connecticut", "Gresham, Oregon", "Fairfield, California", "Billings, Montana", "Lowell, Massachusetts", "San Buenaventura (Ventura), California", "Pueblo, Colorado", "High Point, North Carolina", "West Covina, California", "Richmond, California", "Murrieta, California", "Cambridge, Massachusetts", "Antioch, California", "Temecula, California", "Norwalk, California", "Centennial, Colorado", "Everett, Washington", "Palm Bay, Florida", "Wichita Falls, Texas", "Green Bay, Wisconsin", "Daly City, California", "Burbank, California", "Richardson, Texas", "Pompano Beach, Florida", "North Charleston, South Carolina", "Broken Arrow, Oklahoma", "Boulder, Colorado", "West Palm Beach, Florida", "Santa Maria, California", "El Cajon, California", "Davenport, Iowa", "Rialto, California", "Las Cruces, New Mexico", "San Mateo, California", "Lewisville, Texas", "South Bend, Indiana", "Lakeland, Florida", "Erie, Pennsylvania", "Tyler, Texas", "Pearland, Texas", "College Station, Texas", "Kenosha, Wisconsin", "Sandy Springs, Georgia", "Clovis, California", "Flint, Michigan", "Roanoke, Virginia", "Albany, New York", "Jurupa Valley, California", "Compton, California", "San Angelo, Texas", "Hillsboro, Oregon", "Lawton, Oklahoma", "Renton, Washington", "Vista, California", "Davie, Florida", "Greeley, Colorado", "Mission Viejo, California", "Portsmouth, Virginia", "Dearborn, Michigan", "South Gate, California", "Tuscaloosa, Alabama", "Livonia, Michigan", "New Bedford, Massachusetts", "Vacaville, California", "Brockton, Massachusetts", "Roswell, Georgia", "Beaverton, Oregon", "Quincy, Massachusetts", "Sparks, Nevada", "Yakima, Washington", "Lee's Summit, Missouri", "Federal Way, Washington", "Carson, California", "Santa Monica, California", "Hesperia, California", "Allen, Texas", "Rio Rancho, New Mexico", "Yuma, Arizona", "Westminster, California", "Orem, Utah", "Lynn, Massachusetts", "Redding, California", "Spokane Valley, Washington", "Miami Beach, Florida", "League City, Texas", "Lawrence, Kansas", "Santa Barbara, California", "Plantation, Florida", "Sandy, Utah", "Sunrise, Florida", "Macon, Georgia", "Longmont, Colorado", "Boca Raton, Florida", "San Marcos, California", "Greenville, North Carolina", "Waukegan, Illinois", "Fall River, Massachusetts", "Chico, California", "Newton, Massachusetts", "San Leandro, California", "Reading, Pennsylvania", "Norwalk, Connecticut", "Fort Smith, Arkansas", "Newport Beach, California", "Asheville, North Carolina", "Nashua, New Hampshire", "Edmond, Oklahoma", "Whittier, California", "Nampa, Idaho", "Bloomington, Minnesota", "Deltona, Florida", "Hawthorne, California", "Duluth, Minnesota", "Carmel, Indiana", "Suffolk, Virginia", "Clifton, New Jersey", "Citrus Heights, California", "Livermore, California", "Tracy, California", "Alhambra, California", "Kirkland, Washington", "Trenton, New Jersey", "Ogden, Utah", "Hoover, Alabama", "Cicero, Illinois", "Fishers, Indiana", "Sugar Land, Texas", "Danbury, Connecticut", "Meridian, Idaho", "Indio, California", "Concord, North Carolina", "Menifee, California", "Champaign, Illinois", "Buena Park, California", "Troy, Michigan", "O'Fallon, Missouri", "Johns Creek, Georgia", "Bellingham, Washington", "Westland, Michigan", "Bloomington, Indiana", "Sioux City, Iowa", "Warwick, Rhode Island", "Hemet, California", "Longview, Texas", "Farmington Hills, Michigan", "Bend, Oregon", "Lakewood, California", "Merced, California", "Mission, Texas", "Chino, California", "Redwood City, California", "Edinburg, Texas", "Cranston, Rhode Island", "Parma, Ohio", "New Rochelle, New York", "Lake Forest, California", "Napa, California", "Hammond, Indiana", "Fayetteville, Arkansas", "Bloomington, Illinois", "Avondale, Arizona", "Somerville, Massachusetts", "Palm Coast, Florida", "Bryan, Texas", "Gary, Indiana", "Largo, Florida", "Brooklyn Park, Minnesota", "Tustin, California", "Racine, Wisconsin", "Deerfield Beach, Florida", "Lynchburg, Virginia", "Mountain View, California", "Medford, Oregon", "Lawrence, Massachusetts", "Bellflower, California", "Melbourne, Florida", "St. Joseph, Missouri", "Camden, New Jersey", "St. George, Utah", "Kennewick, Washington", "Baldwin Park, California", "Chino Hills, California", "Alameda, California", "Albany, Georgia", "Arlington Heights, Illinois", "Scranton, Pennsylvania", "Evanston, Illinois", "Kalamazoo, Michigan", "Baytown, Texas", "Upland, California", "Springdale, Arkansas", "Bethlehem, Pennsylvania", "Schaumburg, Illinois", "Mount Pleasant, South Carolina", "Auburn, Washington", "Decatur, Illinois", "San Ramon, California", "Pleasanton, California", "Wyoming, Michigan", "Lake Charles, Louisiana", "Plymouth, Minnesota", "Bolingbrook, Illinois", "Pharr, Texas", "Appleton, Wisconsin", "Gastonia, North Carolina", "Folsom, California", "Southfield, Michigan", "Rochester Hills, Michigan", "New Britain, Connecticut", "Goodyear, Arizona", "Canton, Ohio", "Warner Robins, Georgia", "Union City, California", "Perris, California", "Manteca, California", "Iowa City, Iowa", "Jonesboro, Arkansas", "Wilmington, Delaware", "Lynwood, California", "Loveland, Colorado", "Pawtucket, Rhode Island", "Boynton Beach, Florida", "Waukesha, Wisconsin", "Gulfport, Mississippi", "Apple Valley, California", "Passaic, New Jersey", "Rapid City, South Dakota", "Layton, Utah", "Lafayette, Indiana", "Turlock, California", "Muncie, Indiana", "Temple, Texas", "Missouri City, Texas", "Redlands, California", "Santa Fe, New Mexico", "Lauderhill, Florida", "Milpitas, California", "Palatine, Illinois", "Missoula, Montana", "Rock Hill, South Carolina", "Jacksonville, North Carolina", "Franklin, Tennessee", "Flagstaff, Arizona", "Flower Mound, Texas", "Weston, Florida", "Waterloo, Iowa", "Union City, New Jersey", "Mount Vernon, New York", "Fort Myers, Florida", "Dothan, Alabama", "Rancho Cordova, California", "Redondo Beach, California", "Jackson, Tennessee", "Pasco, Washington", "St. Charles, Missouri", "Eau Claire, Wisconsin", "North Richland Hills, Texas", "Bismarck, North Dakota", "Yorba Linda, California", "Kenner, Louisiana", "Walnut Creek, California", "Frederick, Maryland", "Oshkosh, Wisconsin", "Pittsburg, California", "Palo Alto, California", "Bossier City, Louisiana", "Portland, Maine", "St. Cloud, Minnesota", "Davis, California", "South San Francisco, California", "Camarillo, California", "North Little Rock, Arkansas", "Schenectady, New York", "Gaithersburg, Maryland", "Harlingen, Texas", "Woodbury, Minnesota", "Eagan, Minnesota", "Yuba City, California", "Maple Grove, Minnesota", "Youngstown, Ohio", "Skokie, Illinois", "Kissimmee, Florida", "Johnson City, Tennessee", "Victoria, Texas", "San Clemente, California", "Bayonne, New Jersey", "Laguna Niguel, California", "East Orange, New Jersey", "Shawnee, Kansas", "Homestead, Florida", "Rockville, Maryland", "Delray Beach, Florida", "Janesville, Wisconsin", "Conway, Arkansas", "Pico Rivera, California", "Lorain, Ohio", "Montebello, California", "Lodi, California", "New Braunfels, Texas", "Marysville, Washington", "Tamarac, Florida", "Madera, California", "Conroe, Texas", "Santa Cruz, California", "Eden Prairie, Minnesota", "Cheyenne, Wyoming", "Daytona Beach, Florida", "Alpharetta, Georgia", "Hamilton, Ohio", "Waltham, Massachusetts", "Coon Rapids, Minnesota", "Haverhill, Massachusetts", "Council Bluffs, Iowa", "Taylor, Michigan", "Utica, New York", "Ames, Iowa", "La Habra, California", "Encinitas, California", "Bowling Green, Kentucky", "Burnsville, Minnesota", "Greenville, South Carolina", "West Des Moines, Iowa", "Cedar Park, Texas", "Tulare, California", "Monterey Park, California", "Vineland, New Jersey", "Terre Haute, Indiana", "North Miami, Florida", "Mansfield, Texas", "West Allis, Wisconsin", "Bristol, Connecticut", "Taylorsville, Utah", "Malden, Massachusetts", "Meriden, Connecticut", "Blaine, Minnesota", "Wellington, Florida", "Cupertino, California", "Springfield, Oregon", "Rogers, Arkansas", "St. Clair Shores, Michigan", "Gardena, California", "Pontiac, Michigan", "National City, California", "Grand Junction, Colorado", "Rocklin, California", "Chapel Hill, North Carolina", "Casper, Wyoming", "Broomfield, Colorado", "Petaluma, California", "South Jordan, Utah", "Springfield, Ohio", "Great Falls, Montana", "Lancaster, Pennsylvania", "North Port, Florida", "Lakewood, Washington", "Marietta, Georgia", "San Rafael, California", "Royal Oak, Michigan", "Des Plaines, Illinois", "Huntington Park, California", "La Mesa, California", "Orland Park, Illinois", "Auburn, Alabama", "Lakeville, Minnesota", "Owensboro, Kentucky", "Moore, Oklahoma", "Jupiter, Florida", "Idaho Falls, Idaho", "Dubuque, Iowa", "Bartlett, Tennessee", "Rowlett, Texas", "Novi, Michigan", "White Plains, New York", "Arcadia, California", "Redmond, Washington", "Lake Elsinore, California", "Ocala, Florida", "Tinley Park, Illinois", "Port Orange, Florida", "Medford, Massachusetts", "Oak Lawn, Illinois", "Rocky Mount, North Carolina", "Kokomo, Indiana", "Coconut Creek, Florida", "Bowie, Maryland", "Berwyn, Illinois", "Midwest City, Oklahoma", "Fountain Valley, California", "Buckeye, Arizona", "Dearborn Heights, Michigan", "Woodland, California", "Noblesville, Indiana", "Valdosta, Georgia", "Diamond Bar, California", "Manhattan, Kansas", "Santee, California", "Taunton, Massachusetts", "Sanford, Florida", "Kettering, Ohio", "New Brunswick, New Jersey", "Decatur, Alabama", "Chicopee, Massachusetts", "Anderson, Indiana", "Margate, Florida", "Weymouth Town, Massachusetts", "Hempstead, New York", "Corvallis, Oregon", "Eastvale, California", "Porterville, California", "West Haven, Connecticut", "Brentwood, California", "Paramount, California", "Grand Forks, North Dakota", "Georgetown, Texas", "St. Peters, Missouri", "Shoreline, Washington", "Mount Prospect, Illinois", "Hanford, California", "Normal, Illinois", "Rosemead, California", "Lehi, Utah", "Pocatello, Idaho", "Highland, California", "Novato, California", "Port Arthur, Texas", "Carson City, Nevada", "San Marcos, Texas", "Hendersonville, Tennessee", "Elyria, Ohio", "Revere, Massachusetts", "Pflugerville, Texas", "Greenwood, Indiana", "Bellevue, Nebraska", "Wheaton, Illinois", "Smyrna, Georgia", "Sarasota, Florida", "Blue Springs, Missouri", "Colton, California", "Euless, Texas", "Castle Rock, Colorado", "Cathedral City, California", "Kingsport, Tennessee", "Lake Havasu City, Arizona", "Pensacola, Florida", "Hoboken, New Jersey", "Yucaipa, California", "Watsonville, California", "Richland, Washington", "Delano, California", "Hoffman Estates, Illinois", "Florissant, Missouri", "Placentia, California", "West New York, New Jersey", "Dublin, California", "Oak Park, Illinois", "Peabody, Massachusetts", "Perth Amboy, New Jersey", "Battle Creek, Michigan", "Bradenton, Florida", "Gilroy, California", "Milford, Connecticut", "Albany, Oregon", "Ankeny, Iowa", "La Crosse, Wisconsin", "Burlington, North Carolina", "DeSoto, Texas", "Harrisonburg, Virginia", "Minnetonka, Minnesota", "Elkhart, Indiana", "Lakewood, Ohio", "Glendora, California", "Southaven, Mississippi", "Charleston, West Virginia", "Joplin, Missouri", "Enid, Oklahoma", "Palm Beach Gardens, Florida", "Brookhaven, Georgia", "Plainfield, New Jersey", "Grand Island, Nebraska", "Palm Desert, California", "Huntersville, North Carolina", "Tigard, Oregon", "Lenexa, Kansas", "Saginaw, Michigan", "Kentwood, Michigan", "Doral, Florida", "Apple Valley, Minnesota", "Grapevine, Texas", "Aliso Viejo, California", "Sammamish, Washington", "Casa Grande, Arizona", "Pinellas Park, Florida", "Troy, New York", "West Sacramento, California", "Burien, Washington", "Commerce City, Colorado", "Monroe, Louisiana", "Cerritos, California", "Downers Grove, Illinois", "Coral Gables, Florida", "Wilson, North Carolina", "Niagara Falls, New York", "Poway, California", "Edina, Minnesota", "Cuyahoga Falls, Ohio", "Rancho Santa Margarita, California", "Harrisburg, Pennsylvania", "Huntington, West Virginia", "La Mirada, California", "Cypress, California", "Caldwell, Idaho", "Logan, Utah", "Galveston, Texas", "Sheboygan, Wisconsin", "Middletown, Ohio", "Murray, Utah", "Roswell, New Mexico", "Parker, Colorado", "Bedford, Texas", "East Lansing, Michigan", "Methuen, Massachusetts", "Covina, California", "Alexandria, Louisiana", "Olympia, Washington", "Euclid, Ohio", "Mishawaka, Indiana", "Salina, Kansas", "Azusa, California", "Newark, Ohio", "Chesterfield, Missouri", "Leesburg, Virginia", "Dunwoody, Georgia", "Hattiesburg, Mississippi", "Roseville, Michigan", "Bonita Springs, Florida", "Portage, Michigan", "St. Louis Park, Minnesota", "Collierville, Tennessee", "Middletown, Connecticut", "Stillwater, Oklahoma", "East Providence, Rhode Island", "Lawrence, Indiana", "Wauwatosa, Wisconsin", "Mentor, Ohio", "Ceres, California", "Cedar Hill, Texas", "Mansfield, Ohio", "Binghamton, New York", "Coeur d'Alene, Idaho", "San Luis Obispo, California", "Minot, North Dakota", "Palm Springs, California", "Pine Bluff, Arkansas", "Texas City, Texas", "Summerville, South Carolina", "Twin Falls, Idaho", "Jeffersonville, Indiana", "San Jacinto, California", "Madison, Alabama", "Altoona, Pennsylvania", "Columbus, Indiana", "Beavercreek, Ohio", "Apopka, Florida", "Elmhurst, Illinois", "Maricopa, Arizona", "Farmington, New Mexico", "Glenview, Illinois", "Cleveland Heights, Ohio", "Draper, Utah", "Lincoln, California", "Sierra Vista, Arizona", "Lacey, Washington", "Biloxi, Mississippi", "Strongsville, Ohio", "Barnstable Town, Massachusetts", "Wylie, Texas", "Sayreville, New Jersey", "Kannapolis, North Carolina", "Charlottesville, Virginia", "Littleton, Colorado", "Titusville, Florida", "Hackensack, New Jersey", "Newark, California", "Pittsfield, Massachusetts", "York, Pennsylvania", "Lombard, Illinois", "Attleboro, Massachusetts", "DeKalb, Illinois", "Blacksburg, Virginia", "Dublin, Ohio", "Haltom City, Texas", "Lompoc, California", "El Centro, California", "Danville, California", "Jefferson City, Missouri", "Cutler Bay, Florida", "Oakland Park, Florida", "North Miami Beach, Florida", "Freeport, New York", "Moline, Illinois", "Coachella, California", "Fort Pierce, Florida", "Smyrna, Tennessee", "Bountiful, Utah", "Fond du Lac, Wisconsin", "Everett, Massachusetts", "Danville, Virginia", "Keller, Texas", "Belleville, Illinois", "Bell Gardens, California", "Cleveland, Tennessee", "North Lauderdale, Florida", "Fairfield, Ohio", "Salem, Massachusetts", "Rancho Palos Verdes, California", "San Bruno, California", "Concord, New Hampshire", "Burlington, Vermont", "Apex, North Carolina", "Midland, Michigan", "Altamonte Springs, Florida", "Hutchinson, Kansas", "Buffalo Grove, Illinois", "Urbandale, Iowa", "State College, Pennsylvania", "Urbana, Illinois", "Plainfield, Illinois", "Manassas, Virginia", "Bartlett, Illinois", "Kearny, New Jersey", "Oro Valley, Arizona", "Findlay, Ohio", "Rohnert Park, California", "Westfield, Massachusetts", "Linden, New Jersey", "Sumter, South Carolina", "Wilkes-Barre, Pennsylvania", "Woonsocket, Rhode Island", "Leominster, Massachusetts", "Shelton, Connecticut", "Brea, California", "Covington, Kentucky", "Rockwall, Texas", "Meridian, Mississippi", "Riverton, Utah", "St. Cloud, Florida", "Quincy, Illinois", "Morgan Hill, California", "Warren, Ohio", "Edmonds, Washington", "Burleson, Texas", "Beverly, Massachusetts", "Mankato, Minnesota", "Hagerstown, Maryland", "Prescott, Arizona", "Campbell, California", "Cedar Falls, Iowa", "Beaumont, California", "La Puente, California", "Crystal Lake, Illinois", "Fitchburg, Massachusetts", "Carol Stream, Illinois", "Hickory, North Carolina", "Streamwood, Illinois", "Norwich, Connecticut", "Coppell, Texas", "San Gabriel, California", "Holyoke, Massachusetts", "Bentonville, Arkansas", "Florence, Alabama", "Peachtree Corners, Georgia", "Brentwood, Tennessee", "Bozeman, Montana", "New Berlin, Wisconsin", "Goose Creek, South Carolina", "Huntsville, Texas", "Prescott Valley, Arizona", "Maplewood, Minnesota", "Romeoville, Illinois", "Duncanville, Texas", "Atlantic City, New Jersey", "Clovis, New Mexico", "The Colony, Texas", "Culver City, California", "Marlborough, Massachusetts", "Hilton Head Island, South Carolina", "Moorhead, Minnesota", "Calexico, California", "Bullhead City, Arizona", "Germantown, Tennessee", "La Quinta, California", "Lancaster, Ohio", "Wausau, Wisconsin", "Sherman, Texas", "Ocoee, Florida", "Shakopee, Minnesota", "Woburn, Massachusetts", "Bremerton, Washington", "Rock Island, Illinois", "Muskogee, Oklahoma", "Cape Girardeau, Missouri", "Annapolis, Maryland", "Greenacres, Florida", "Ormond Beach, Florida", "Hallandale Beach, Florida", "Stanton, California", "Puyallup, Washington", "Pacifica, California", "Hanover Park, Illinois", "Hurst, Texas", "Lima, Ohio", "Marana, Arizona", "Carpentersville, Illinois", "Oakley, California", "Huber Heights, Ohio", "Lancaster, Texas", "Montclair, California", "Wheeling, Illinois", "Brookfield, Wisconsin", "Park Ridge, Illinois", "Florence, South Carolina", "Roy, Utah", "Winter Garden, Florida", "Chelsea, Massachusetts", "Valley Stream, New York", "Spartanburg, South Carolina", "Lake Oswego, Oregon", "Friendswood, Texas", "Westerville, Ohio", "Northglenn, Colorado", "Phenix City, Alabama", "Grove City, Ohio", "Texarkana, Texas", "Addison, Illinois", "Dover, Delaware", "Lincoln Park, Michigan", "Calumet City, Illinois", "Muskegon, Michigan", "Aventura, Florida", "Martinez, California", "Greenfield, Wisconsin", "Apache Junction, Arizona", "Monrovia, California", "Weslaco, Texas", "Keizer, Oregon", "Spanish Fork, Utah", "Beloit, Wisconsin", "Panama City, Florida"]
  


  locationInput = '';
  locationSuggestions: string[] = [];
  locationFocused = false;

  
  profilePicFile: File | null = null;
  profilePicPreview: string | null = null;

  filters = {
    gender: [] as string[],
    ageRanges: [] as string[],
    lookingfor: [] as string[],
    location: [] as string[],
    sexualorientation: [] as string[],
    professionindustry: [] as string[],
  };

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      location: [''],
      bio: [''],
      gender: [''],
      birthdate: [''],
      lookingfor: [''],
      sexualorientation: [''],
      professionindustry: ['']  
    });
  }

  // ngOnInit(): void {
  //   const token = localStorage.getItem('access_token');
  //   const userId = localStorage.getItem('user_id');
  //   if (!token || !userId) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }

  //   this.http.get(`http://127.0.0.1:8000/users/${userId}`).subscribe((data: any) => {
  //     this.profileForm.patchValue(data);
  //   });

  //     // Initially, show all professions
  //   this.filteredProfessions = this.professionOptions;
  // }


  ngOnInit(): void {
  let token = null;
  let userId = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
    userId = localStorage.getItem('user_id');
  }

  if (!token || !userId) {
    this.router.navigate(['/login']);
    return;
  }

  this.http.get(`http://127.0.0.1:8000/users/${userId}`).subscribe((data: any) => {
    this.profileForm.patchValue(data);
  });

  // Initially, show all professions
  this.filteredProfessions = this.professionOptions;
}


    // Filter professions based on user input
filterProfessions(event: Event): void {
  const input = event.target as HTMLInputElement;  // Cast to HTMLInputElement
  const value = input.value;  // Extract the value
  this.filteredProfessions = this.professionOptions.filter(prof => prof.toLowerCase().includes(value.toLowerCase()));
}

  
  showUploadModal = false;
  uploadedImageFiles: File[] = [];
  uploadedImages: { file: File; url: string }[] = [];

  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    console.log('Files selected:', files);

    if (files && files.length + this.uploadedImages.length <= 6) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push({ file, url: e.target.result });
        };
        reader.readAsDataURL(file);
      });
    } else {
      alert('Maximum 6 images allowed.');
    }
  }

  onProfilePicSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.profilePicFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePicPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadProfilePicture(): void {
    if (!this.profilePicFile) return;

    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const formData = new FormData();
    formData.append('file', this.profilePicFile);

    this.http.post(`http://127.0.0.1:8000/profile-picture/upload?user_id=${userId}`, formData).subscribe({
      next: (res: any) => {
        alert('Profile picture uploaded!');
        this.profilePicFile = null;
        this.profilePicPreview = null;
      },
      error: err => {
        console.error(err);
        alert('Profile picture upload failed');
      }
    });
  }

  uploadPictures(): void {
    console.log('Upload button clicked');
    if (this.uploadedImages.length === 0) {
      alert('Please select at least one image to upload.');
      return;
    }

    const formData = new FormData();
    this.uploadedImages.forEach((imgObj) => {
      formData.append('files', imgObj.file);
    });

    this.http.post('/api/upload', formData).subscribe({
      next: (res) => {
        console.log('Upload success:', res);
        alert('Images uploaded successfully!');
        this.uploadedImages = [];
      },
      error: (err) => {
        console.error('Upload failed:', err);
        alert('Upload failed.');
      },
    });
  }

  savePictures() {
    const userId = localStorage.getItem('user_id');
    if (!userId || this.uploadedImages.length === 0) return;

    const formData = new FormData();
    this.uploadedImages.forEach(img => formData.append('files', img.file));

    this.http.post(`http://127.0.0.1:8000/users/${userId}/upload_pictures`, formData)
      .subscribe({
        next: res => {
          alert('Upload successful!');
          this.closeUploadModal();
        },
        error: err => {
          console.error(err);
          alert('Upload failed');
        }
      });
  }

  openUploadModal(event: Event): void {
    event.preventDefault();
    this.showUploadModal = true;
  }

  cancelUpload() {
    this.uploadedImages = [];
    this.closeUploadModal();
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

 // Set profession as a string when selected
  selectProfession(prof: string): void {
    if (prof) {
      this.profileForm.get('professionindustry')?.setValue(prof);  // Set value as a string
    }
  }

  removeProfession(index: number): void {
    const currentList = this.profileForm.get('professionindustry')?.value || [];
    currentList.splice(index, 1);
    this.profileForm.get('professionindustry')?.setValue([...currentList]);  // Update the array in the form
  }

  selectLocation(loc: string) {
    loc = loc.trim();
    if (loc && !this.filters.location.includes(loc)) {
      this.filters.location.push(loc);
    }
    this.locationInput = '';
    this.locationFocused = false;
  }

  onLocationBlur() {
    setTimeout(() => this.locationFocused = false, 200);
  }



  onSubmit(): void {
    const userId = localStorage.getItem('user_id');
    if (userId && this.profileForm.valid) {
      const rawData = this.profileForm.value;

      // Send updated data to the backend
      this.http.put(`http://127.0.0.1:8000/users/${userId}`, rawData).subscribe({
        next: () => {
          alert('Profile updated!');
          this.router.navigate(['/my-profile'], { state: { updated: true } });
        },
        error: (err) => {
          alert('Update failed: ' + err.message);
          console.error('Error details:', err);
        }
      });
    }
  }
}





