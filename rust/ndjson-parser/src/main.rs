use rand::{thread_rng, Rng};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;
use std::io::{BufRead, BufReader};
use std::time::SystemTime;

#[derive(Deserialize, Debug)]
struct CaseBodyData {
    head_matter: String,
}

#[derive(Deserialize, Debug)]
struct CaseBody {
    data: CaseBodyData,
}

#[derive(Deserialize, Debug)]
struct Datum {
    name: String,
    casebody: CaseBody,
}

#[derive(Serialize, Debug)]
struct Document {
    name: String,
    matter: String,
}

#[derive(Serialize, Debug)]
struct Output {
    id: String,
    score: f32,
    document: Document,
}

fn unique_id_generator() -> impl FnMut() -> String {
    let base_id = String::from(
        SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_millis()
            .to_string()
            .get(5..)
            .unwrap(),
    );
    let mut latest_id: usize = 0;

    move || -> String {
        let id = format!("{base_id}-{latest_id}");
        latest_id += 1;
        id
    }
}

fn parse_ndjson_to_file(input_file_url: &str, output_file_url: &str) -> std::io::Result<()> {
    let input_file = File::open(input_file_url)?;
    let data = parse_ndjson(input_file)?;

    let data_as_string = serde_json::to_string(&data)?;
    let mut output_file = File::create(output_file_url)?;
    output_file.write(data_as_string.as_bytes())?;

    Ok(())
}

fn parse_ndjson(input_file: File) -> std::io::Result<Vec<Output>> {
    let mut rng = thread_rng();
    let mut reader = BufReader::new(input_file);
    let mut data: Vec<Output> = vec![];

    let mut get_unique_id = unique_id_generator();

    let mut buffer = String::new();
    let mut eof = false;

    while !eof {
        match reader.read_line(&mut buffer) {
            Ok(0) => eof = true,
            Ok(_) => {
                let datum = serde_json::from_str::<Datum>(&buffer).unwrap();

                data.push(Output {
                    id: get_unique_id(),
                    score: rng.gen::<f32>() * 0.5,
                    document: Document {
                        name: datum.name,
                        matter: datum.casebody.data.head_matter,
                    },
                });

                buffer.clear();
            }
            Err(err) => return Err(err),
        };
    }

    Ok(data)
}

fn main() -> std::io::Result<()> {
    parse_ndjson_to_file("../data/data.jsonl", "../data/output/parsed-rust.json")?;

    Ok(())
}
